const { Router } = require('express');
const followerController = require('../controllers/followersController');

const routes = Router({ mergeParams: true }); // Merge to access parent params i.e. /reviews/:addr/:id

routes.get('/:userId/', followerController.getFollowersUnfollowers);

module.exports = routes;