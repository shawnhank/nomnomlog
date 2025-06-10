const express = require('express');
const router = express.Router();
const mealsCtrl = require('../controllers/meals');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/meals'

// Get all meals (for the logged-in user)
router.get('/', ensureLoggedIn, mealsCtrl.getAll);

// Get all favorite meals
router.get('/favorites', ensureLoggedIn, mealsCtrl.getFavorites);

// Get all thumbs up meals
router.get('/thumbs-up', ensureLoggedIn, mealsCtrl.getThumbsUp);

// Get all thumbs down meals
router.get('/thumbs-down', ensureLoggedIn, mealsCtrl.getThumbsDown);

// Get all unrated meals (no thumbs rating)
router.get('/unrated', ensureLoggedIn, mealsCtrl.getUnrated);

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

module.exports = router;
