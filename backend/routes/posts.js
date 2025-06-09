const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/posts'

// Protect all defined routes
router.use(ensureLoggedIn);

// GET /api/posts (INDEX action)
router.get('/', postsCtrl.index);
// POST /api/posts (CREATE action)
router.post('/', postsCtrl.create);

module.exports = router;