const { getOneTimeAccessToken } = require("./auth");
const { get } = require("axios");
const Follower = require("../models/Follower");

exports.getFollowersFromUserId = async (userId) => {
  const accessToken = await getOneTimeAccessToken();
  const currentFollowers = await requestFollowers(accessToken, userId);
  return currentFollowers;
};

exports.requestFollowers = (accessToken, userId) => {
  const followersURL = `https://spclient.wg.spotify.com/user-profile-view/v3/profile/${userId}/followers?market=TR`;

  return get(followersURL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    // }).then(response => response.data.profiles)
  })
    .then((response) => {
      return response.data.profiles.splice(0, 25); // Debug
      // return response.data.profiles
    })
    .then((followers) => {
      return followers.map((follower) => {
        return new Follower({
          uri: follower.uri,
          name: follower.name,
          imageUrl: follower.image_url,
          followersCount: follower.followers_count,
          followingCount: follower.following_count,
        });
      });
    });
};
