const express = require('express');
const router = express.Router();
const tagsCtrl = require('../controllers/tags');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/tags'

// Get all tags (for the logged-in user)
router.get('/', ensureLoggedIn, tagsCtrl.getAll);

// Create a new tag
router.post('/', ensureLoggedIn, tagsCtrl.create);

// Update a tag
router.put('/:id', ensureLoggedIn, tagsCtrl.update);

// Delete a tag
router.delete('/:id', ensureLoggedIn, tagsCtrl.delete);

module.exports = router;