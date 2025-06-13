const express = require('express');
const router = express.Router();
const restaurantsCtrl = require('../controllers/restaurants');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/restaurants'

// Protected routes - require authentication
router.use(ensureLoggedIn);

// Get all restaurants
router.get('/', restaurantsCtrl.index);

// Get all thumbs up restaurants
router.get('/thumbs-up', restaurantsCtrl.getThumbsUp);

// Get all thumbs down restaurants
router.get('/thumbs-down', restaurantsCtrl.getThumbsDown);

// Get all unrated restaurants
router.get('/unrated', restaurantsCtrl.getUnrated);

// Get one restaurant
router.get('/:id', restaurantsCtrl.show);

// Create a restaurant
router.post('/', restaurantsCtrl.create);

// Update a restaurant
router.put('/:id', restaurantsCtrl.update);

// Delete a restaurant
router.delete('/:id', restaurantsCtrl.delete);

// Set thumbs rating
router.put('/:id/thumbs', restaurantsCtrl.setThumbsRating);

module.exports = router;
