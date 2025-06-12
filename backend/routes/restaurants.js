const express = require('express');
const router = express.Router();
const restaurantsCtrl = require('../controllers/restaurants');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/restaurants'

// Protected routes - require authentication
router.use(ensureLoggedIn);

// Get all restaurants
router.get('/', restaurantsCtrl.index);

// Get all favorite restaurants
router.get('/favorites', restaurantsCtrl.getFavorites);

// Get one restaurant
router.get('/:id', restaurantsCtrl.show);

// Create a restaurant
router.post('/', restaurantsCtrl.create);

// Update a restaurant
router.put('/:id', restaurantsCtrl.update);

// Delete a restaurant
router.delete('/:id', restaurantsCtrl.delete);

// Toggle favorite status
router.put('/:id/favorite', restaurantsCtrl.toggleFavorite);

module.exports = router;
