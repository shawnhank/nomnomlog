const express = require('express');
const router = express.Router();
const mealTagsCtrl = require('../controllers/mealTags');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/meal-tags'

// Get all tags for a specific meal
router.get('/meal/:mealId', ensureLoggedIn, mealTagsCtrl.getAllForMeal);

// Create a new meal-tag relationship
router.post('/', ensureLoggedIn, mealTagsCtrl.create);

// Delete a meal-tag relationship
router.delete('/:id', ensureLoggedIn, mealTagsCtrl.delete);

// Add a more descriptive endpoint for deleting a relationship
router.delete('/meal/:mealId/tag/:tagId', ensureLoggedIn, mealTagsCtrl.deleteByMealAndTag);

// Delete all tags for a meal
router.delete('/meal/:mealId', ensureLoggedIn, mealTagsCtrl.deleteAllForMeal);

module.exports = router;
