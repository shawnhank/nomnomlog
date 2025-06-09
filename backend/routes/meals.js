const express = require('express');
const router = express.Router();
const mealsCtrl = require('../controllers/meals');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/meals'

// Get all meals (for the logged-in user)
router.get('/', ensureLoggedIn, mealsCtrl.getAll);

// Get one meal by ID
router.get('/:id', ensureLoggedIn, mealsCtrl.getOne);

// Create a new meal
router.post('/', ensureLoggedIn, mealsCtrl.create);

// Update a meal
router.put('/:id', ensureLoggedIn, mealsCtrl.update);

// Delete a meal
router.delete('/:id', ensureLoggedIn, mealsCtrl.delete);

// Toggle favorite status
router.put('/:id/favorite', ensureLoggedIn, mealsCtrl.toggleFavorite);

// Set thumbs rating
router.put('/:id/thumbs', ensureLoggedIn, mealsCtrl.setThumbsRating);

// Get all favorite meals
router.get('/favorites', ensureLoggedIn, mealsCtrl.getFavorites);

module.exports = router;
