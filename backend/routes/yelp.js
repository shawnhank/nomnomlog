const express = require('express');
const router = express.Router();
const yelpCtrl = require('../controllers/yelp');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/yelp'

// Protect all routes
router.use(ensureLoggedIn);

// Search for restaurants
router.get('/search', yelpCtrl.search);

// Get business details
router.get('/business/:id', yelpCtrl.getBusinessDetails);

// Autocomplete search terms
router.get('/autocomplete', yelpCtrl.autocomplete);

module.exports = router;