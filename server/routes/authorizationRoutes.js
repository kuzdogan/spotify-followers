const { Router } = require('express');
const authorizationController = require('../controllers/authorizationController');

const routes = Router({ mergeParams: true }); // Merge to access parent params i.e. /reviews/:addr/:id

//GET 
routes.post('/', authorizationController.getAccessToken);

//GET 
routes.get('/refresh/:userId', authorizationController.getRefreshedToken);

module.exports = routes;