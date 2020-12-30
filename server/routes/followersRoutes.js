const { Router } = require('express');
const followerController = require('../controllers/followersController');

const routes = Router({ mergeParams: true }); // Merge to access parent params i.e. /reviews/:addr/:id

//GET user/:userId/followers
routes.get('/:userId/followers', followerController.getFollowers);

//GET user/:userId/follower-unfollower-diff
routes.get('/:userId/follower-unfollower-diff', followerController.getFollowersUnfollowers);

module.exports = routes;