const express = require('express');
const router = express.Router();
const restaurantTagsCtrl = require('../controllers/restaurantTags');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/restaurant-tags'

// Get all tags for a specific restaurant
router.get('/restaurant/:restaurantId', ensureLoggedIn, restaurantTagsCtrl.getAllForRestaurant);

// Create a new restaurant-tag relationship
router.post('/', ensureLoggedIn, restaurantTagsCtrl.create);

// Delete a restaurant-tag relationship
router.delete('/:id', ensureLoggedIn, restaurantTagsCtrl.delete);

// Delete all tags for a restaurant
router.delete('/restaurant/:restaurantId', ensureLoggedIn, restaurantTagsCtrl.deleteAllForRestaurant);

module.exports = router;