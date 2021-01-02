const { get } = require('axios');
const User = require('../models/User');
const Follower = require('../models/Follower');

const TOKEN_URL = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";

// GET /user/:userId/follower-unfollower-diff
exports.getFollowersUnfollowers = function (req, res) {
    const userId = req.params.userId
    if (!userId)
        return res.status(400).send('Bad Request')
    checkUser(userId)
        .then(user => {
            if (user) {
                console.log(`User ${user.id} exists`)
                return checkFollowerDifference(user.id)
                    .then(([newFollowers, unfollowers]) => {
                        console.log('New followers are: ', newFollowers);
                        console.log('Unfollowers are: ', unfollowers)
                        return updateFollowersOfUser(newFollowers, unfollowers, user)
                            .then(() => [newFollowers, unfollowers])
                    })
                    .then(([newFollowers, unfollowers]) => {
                        const diff = { newFollowers, unfollowers };
                        return res.status(200).json(diff);
                    })
            } else {
                console.log(`User does not exist. Creating user ${userId}`)
                return createUser(userId)
                    .then(user => {
                        console.log('Successfully created user ' + user.id)
                        res.status(201).json(user);
                    })
            }
        })
        .catch(err => console.error(err))

}

// GET /user/:userId/followers
exports.getFollowers = function (req, res) {
    console.log('Get followers called');
    const userId = req.params.userId;
    if (!userId)
        return res.status(400).send('Bad Request');
    return getFollowers(userId)
        .then(followers => {
            res.status(200).json({followers: followers});
        })
        .catch(err => {
            res.status(404).json({followers: [], message: err});
        });
}
 

/**
 * Function to check if user exists on the db. 
 * 
 * @returns {Promise} resolving to the user object if exist, null otherwise
 * @param {String} userId - Spotify ID of the user
 */
function checkUser(userId) {
    console.log('Checking User ' + userId)
    return User.findOne({ id: userId })
}

async function checkFollowerDifference(userId) {
    console.log(`Checking newfollowers and unfollowers`);
    const accessToken = await getAccessToken();
    const currentFollowers = await requestFollowers(accessToken, userId)
    const previousFollowers = await queryPreviousFollowers(userId)

    const [newFollowers, unfollowers] = compareFollowers(currentFollowers, previousFollowers);
    return [newFollowers, unfollowers];
}

/**
 * Function to create a user in the db.
 * 
 * @returns {Promise} resolving to the created user object
 * @param {String} userId 
 */
function createUser(userId) {
    return getAccessToken()
        .then(accessToken => {
            return requestFollowers(accessToken, userId)
        }).then(followers => {
            return saveFollowers(followers)
        }).then(followers => {
            return new User({
                id: userId,
                followers: followers.map(follower => follower._id)
            })
        }).then(user => {
            return user.save()
        });
}

async function getAccessToken() {
    const { data } = await get(TOKEN_URL)
    console.log(`Got access token ${data.accessToken}`);
    return data.accessToken;
}

/**
 * Function to get the previous followers of a user that are saved in the db.
 * 
 * @returns {Promise} resolving to an array of saved followers of a user 
 * @param {String} userId 
 */
function queryPreviousFollowers(userId) {
    return User.findOne({ id: userId }).populate('followers').then(user => user.followers);
}

function saveFollowers(followers) {
    let promises = [];

    for (follower of followers) {
        let dbFollower = new Follower({
            uri: follower.uri,
            name: follower.name,
            imageURL: follower.image_url,
            followersCount: follower.followers_count,
            followingCount: follower.following_count
        })
        promises.push(dbFollower.save())
    }

    return Promise.all(promises);
}

function requestFollowers(accessToken, userId) {
    const followersURL = `https://spclient.wg.spotify.com/user-profile-view/v3/profile/${userId}/followers?market=TR`

    return get(followersURL, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
        // }).then(response => response.data.profiles)
    }).then(response => response.data.profiles.splice(0, 3)) // Debug
}

/**
 * Function to compare newly fetched followers with the ones saved on the db.
 * 
 * @returns {[Array, Array]} two arrays first as the array of new followers and the second as the unfollowers/
 * @param {Array} currentFollowers 
 * @param {Array} previousFollowers 
 */
function compareFollowers(currentFollowers, previousFollowers) {
    const currentFollowersUris = currentFollowers.map(follower => follower.uri);
    const previousFollowersUris = previousFollowers.map(follower => follower.uri);
    const newFollowers = currentFollowers.filter(follower => !previousFollowersUris.includes(follower.uri))
    const unfollowers = previousFollowers.filter(follower => !currentFollowersUris.includes(follower.uri));
    return [newFollowers, unfollowers]
}

async function updateFollowersOfUser(newFollowers, unfollowers, user) {
    console.log('Adding ', newFollowers.map(x => x.uri));
    console.log('Removing ', unfollowers.map(x => x.uri));
    const followers = await saveFollowers(newFollowers);
    const followerIds = followers.map(x => x._id);
    console.log("Adding new follower refs");
    await User.updateOne({ _id: user._id }, { $push: { followers: { $each: followerIds } } });

    const unfollowerIds = unfollowers.map(x => x._id)
    await Follower.deleteMany({
        _id: {
            $in: unfollowerIds
        }
    })
    console.log("Cleaning unfollower refs")
    await User.updateOne({ _id: user._id }, { $pull: { followers: { $in: unfollowerIds } } });
}

/**
 * Function to get followers
 * 
 * @returns {Promise} resolving to the followers of user.
 * @param {String} userId
 */
async function getFollowers(userId){
    const accessToken = await getAccessToken();
    const currentFollowers = await requestFollowers(accessToken, userId);
    return currentFollowers;
}