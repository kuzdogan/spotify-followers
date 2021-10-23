const { Router } = require("express");
const followerController = require("../controllers/followersController");

const routes = Router({ mergeParams: true }); // Merge to access parent params i.e. /reviews/:addr/:id

//GET user/:userId/followers
routes.get(
  "/:userId/current-followers",
  followerController.getCurrentFollowers
);

//POST user/:userId/follower-diff
routes.post(
  "/:userId/follower-diff",
  followerController.getFollowersUnfollowers
);

module.exports = routes;
