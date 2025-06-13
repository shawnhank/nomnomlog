const express = require('express');
const router = express.Router();
const yelpCtrl = require('../controllers/yelp');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All routes require authentication
router.use(ensureLoggedIn);

// Search for restaurants
router.get('/search', yelpCtrl.search);

// Search for nearby restaurants
router.get('/search/nearby', yelpCtrl.searchNearby);

// Get business details
router.get('/business/:id', yelpCtrl.getBusinessDetails);

// Get business reviews
router.get('/business/:id/reviews', yelpCtrl.getBusinessReviews);

// Autocomplete search terms
router.get('/autocomplete', yelpCtrl.autocomplete);

module.exports = router;
