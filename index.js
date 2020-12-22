const {get} = require('axios');
const User = require('./models/User');
const Follower = require('./models/Follower');
const {connectToServer} = require('./mongoose');

const TOKEN_URL = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";
const PROFILE_ID = "11101586339"
const DB_URL = "mongodb://localhost:27017/test";
connectToServer(DB_URL)

checkUser(PROFILE_ID)
    .then(user => {
        user && checkFollowerDifference(user);
    });

function checkUser(userId) {
    console.log('Checking User')

    return User.findOne({id: userId})
        .then(user => {
            if (user) {
                console.log('User exists!')
                Follower.findById(user.followers[0]._id)
                    .then(follower => {
                        console.log(follower);
                    })
                return user;
            } else {
                console.log('Creating new user')
                createUser(userId)
            }
        })
}

function checkFollowerDifference(user) {
    let previousFollowerIds = user.followers;
    return getAccessToken()
        .then(accessToken => {
            console.log(`Got access token for check difference`, accessToken)
            return requestFollowers(accessToken, PROFILE_ID)
        })
        .then(currentFollowers => {
            fetchFollowers(previousFollowerIds)
                .then(previousFollowers => {
                    let currentFollowerNames = currentFollowers.map(currentFollower => currentFollower.name);
                    let previousFollowerNames = previousFollowers.map(previousFollower => previousFollower.name);
                    let newFollowers = currentFollowerNames.filter(x => !previousFollowerNames.includes(x));
                    let usersToLeaveFollowing = previousFollowerNames.filter(x => !currentFollowerNames.includes(x));
                    let followersDiff = new FollowersDiff(newFollowers, usersToLeaveFollowing);
                    console.log("Difference:", followersDiff)
                })
        })
}

function createUser(userId) {
    getAccessToken()
        .then(accessToken => {
            console.log(`Got access token`, accessToken)
            return requestFollowers(accessToken, PROFILE_ID)
        }).then(followers => {
        return saveFollowers(followers)
    }).then(followers => {
        return new User({
            id: userId,
            followers: followers
        })
    }).then(user => {
        user.save()
    });
}

async function getAccessToken() {
    const {data} = await get(TOKEN_URL)
    return data.accessToken;
}

function fetchFollowers(previousFollowers) {
    let promises = [];
    for (follower of previousFollowers) {
        promises.push(Follower.findById(follower._id))
    }
    return Promise.all(promises);
}

function saveFollowers(followers) {
    let promises = [];

    for (follower of followers) {
        let dbFollower = new Follower({
            id: follower.uri.split(`:`)[2],
            name: follower.name,
            imageUrl: follower.image_url,
            followersCount: follower.followers_count,
            followingCount: follower.following_count
        })
        promises.push(dbFollower.save())
    }

    return Promise.all(promises);
}

async function requestFollowers(accessToken, userId) {
    const followersURL = `https://spclient.wg.spotify.com/user-profile-view/v3/profile/${userId}/followers?market=TR`

    return get(followersURL, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then(response => response.data.profiles)
}

function FollowersDiff(newFollowers, usersToLeaveFollowing) {
    this.newFollowers = newFollowers;
    this.usersToLeaveFollowing = usersToLeaveFollowing;
}