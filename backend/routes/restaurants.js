const express = require('express');
const router = express.Router();
const restaurantsCtrl = require('../controllers/restaurants');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/restaurants'

// Protected routes - require authentication
router.use(ensureLoggedIn);

// GET /api/restaurants - Get all restaurants for the logged-in user
router.get('/', restaurantsCtrl.index);
// POST /api/restaurants - Create a new restaurant
router.post('/', restaurantsCtrl.create);
// GET /api/restaurants/:id - Get a specific restaurant
router.get('/:id', restaurantsCtrl.show);
// PUT /api/restaurants/:id - Update a restaurant
router.put('/:id', restaurantsCtrl.update);
// DELETE /api/restaurants/:id - Delete a restaurant
router.delete('/:id', restaurantsCtrl.delete);

module.exports = router;