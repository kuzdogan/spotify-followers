const Follower = require("../models/Follower");
const { getOneTimeAccessToken } = require("./auth");
const { get } = require("axios");
const User = require("../models/User");
const { requestFollowers } = require("./spotify");

/**
 * Function to check if user exists on the db.
 *
 * @returns {Promise} resolving to the user object if exist, null otherwise
 * @param {String} userId - Spotify ID of the user
 */
exports.checkUser = (userId) => {
  console.log("Checking User " + userId);
  return User.findOne({ id: userId });
};

/**
 * Function to create a user in the db.
 *
 * @returns {Promise} resolving to the created user object
 * @param {String} userId
 */
exports.createUser = (userId) => {
  return getAccessToken()
    .then((accessToken) => {
      return requestFollowers(accessToken, userId);
    })
    .then((followers) => {
      return saveFollowers(followers);
    })
    .then((followers) => {
      return new User({
        id: userId,
        followers: followers.map((follower) => follower._id),
      });
    })
    .then((user) => {
      return user.save();
    });
};

exports.updateFollowersOfUser = async (newFollowers, unfollowers, user) => {
  console.log(
    "Adding ",
    newFollowers.map((x) => x.uri)
  );
  console.log(
    "Removing ",
    unfollowers.map((x) => x.uri)
  );

  // Save current followers as followers
  const followers = await saveFollowers(newFollowers);
  const followerIds = followers.map((x) => x._id);
  console.log("Adding new follower refs");
  // Add follower refs to User
  await User.updateOne(
    { _id: user._id },
    { $push: { followers: { $each: followerIds } } }
  );

  // Remove unfollowers
  const unfollowerIds = unfollowers.map((x) => x._id);
  await Follower.deleteMany({
    _id: {
      $in: unfollowerIds,
    },
  });
  console.log("Cleaning unfollower refs");
  // Remove follower refs from User
  await User.updateOne(
    { _id: user._id },
    { $pull: { followers: { $in: unfollowerIds } } }
  );
};

exports.checkFollowerDifference = async (userId) => {
  console.log(`Checking newfollowers and unfollowers`);
  const accessToken = await getOneTimeAccessToken();
  const currentFollowers = await requestFollowers(accessToken, userId);
  const previousFollowers = await queryPreviousFollowers(userId);

  const [newFollowers, unfollowers] = compareFollowers(
    currentFollowers,
    previousFollowers
  );
  return [newFollowers, unfollowers];
};

/**
 * Function to get the previous followers of a user that are saved in the db.
 *
 * @returns {Promise} resolving to an array of saved followers of a user
 * @param {String} userId
 */
function queryPreviousFollowers(userId) {
  return User.findOne({ id: userId })
    .populate("followers")
    .then((user) => user.followers);
}

function saveSpotifyFollowers(followers) {
  let promises = [];

  for (follower of followers) {
    let dbFollower = new Follower({
      uri: follower.uri,
      name: follower.name,
      imageUrl: follower.image_url,
      followersCount: follower.followers_count,
      followingCount: follower.following_count,
    });
    promises.push(dbFollower.save());
  }
  return Promise.all(promises);
}

function saveFollowers(followers) {
  let promises = [];
  for (follower of followers) {
    promises.push(follower.save());
  }
  return Promise.all(promises);
}

/**
 * Function to compare newly fetched followers with the ones saved on the db.
 *
 * @returns {[Array, Array]} two arrays first as the array of new followers and the second as the unfollowers/
 * @param {Array} currentFollowers
 * @param {Array} previousFollowers
 */
function compareFollowers(currentFollowers, previousFollowers) {
  const currentFollowersUris = currentFollowers.map((follower) => follower.uri);
  const previousFollowersUris = previousFollowers.map(
    (follower) => follower.uri
  );
  const newFollowers = currentFollowers.filter(
    (follower) => !previousFollowersUris.includes(follower.uri)
  );
  const unfollowers = previousFollowers.filter(
    (follower) => !currentFollowersUris.includes(follower.uri)
  );
  return [newFollowers, unfollowers];
}
