const express = require('express');
const router = express.Router();
const uploadsCtrl = require('../controllers/uploads');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/uploads'

// Protect all routes
router.use(ensureLoggedIn);

// GET /api/uploads/sign - Get a pre-signed URL for uploading
router.get('/sign', uploadsCtrl.getSignedUrl);

module.exports = router;