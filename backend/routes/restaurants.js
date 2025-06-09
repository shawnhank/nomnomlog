const express = require('express');
const router = express.Router();
const restaurantsCtrl = require('../controllers/restaurants');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/restaurants'

// Protected routes - require authentication
router.post('/', ensureLoggedIn, restaurantsCtrl.create);

module.exports = router;