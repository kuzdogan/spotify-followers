const { Router } = require('express');
const playlistController = require('../controllers/playlistController');

const routes = Router({ mergeParams: true }); // Merge to access parent params i.e. /reviews/:addr/:id

//GET playlist/:userId
routes.get('/:userId', playlistController.getPlaylists);

module.exports = routes;