const { get } = require('axios');
const User = require('./models/User');
const Follower = require('./models/Follower');
const { connectToServer } = require('./mongoose');

const TOKEN_URL = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";
const PROFILE_ID = "11101586339"
const DB_URI = "mongodb://localhost:27017/test";

connectToServer(DB_URI)
    .then(() => checkUser(PROFILE_ID))
    .then(user => {
        if (user) {
            console.log(`User ${user.id} exists`)
            return checkFollowerDifference(user.id)
                .then(([newFollowers, unfollowers]) => {
                    console.log('New followers are: ', newFollowers);
                    console.log('Unfollowers are: ', unfollowers)
                    return updateFollowersOfUser(newFollowers, unfollowers, user)
                })
        } else {
            console.log(`User does not exist. Creating user ${PROFILE_ID}`)
            return createUser(PROFILE_ID)
                .then(user => {
                    console.log('Successfully created user ' + user.id)
                })
        }
    })
    .catch(err => console.error(err))



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
            imageUrl: follower.image_url,
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
    }).then(response => response.data.profiles)
    // }).then(response => response.data.profiles.splice(0, 3)) // Debug
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