const {get} = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
const Follower = require('./models/Follower');
const {connectToServer} = require('./mongoose');

const TOKEN_URL = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";
const PROFILE_ID = "11101586339"
// getAccessToken();
const DB_URL = "mongodb://localhost:27017/test";
connectToServer(DB_URL)

checkUser(PROFILE_ID);
// .then((user) => {
//     console.log(user)
//     return getAccessToken()
// })
// // TODO: If user does not exist, save all followers. Else fetch and compare.
// .then(accessToken => {
//     console.log(`Got access token`, accessToken)
//     return requestFollowers(accessToken, PROFILE_ID)
// })
// .then(followers => {
//     return followers.splice(0, 5);
// })
// .then(followers => {
//
// })

function checkUser(userId) {
    console.log('Checking User')

    User.findOne({id: userId})
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
                }).then(user => user.save())

            }
        })
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

async function getAccessToken() {
    const {data} = await get(TOKEN_URL)
    return data.accessToken;
}

async function requestFollowers(accessToken, userId) {
    const followersURL = `https://spclient.wg.spotify.com/user-profile-view/v3/profile/${userId}/followers?market=TR`

    return get(followersURL, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then(response => response.data.profiles)
}