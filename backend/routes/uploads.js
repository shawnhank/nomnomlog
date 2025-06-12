const express = require('express');
const router = express.Router();
const uploadsCtrl = require('../controllers/uploads');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// All paths start with '/api/uploads'

// Protect routes that need authentication
router.use('/sign', ensureLoggedIn);
router.use('/proxy', ensureLoggedIn);

// GET /api/uploads/sign - Get a pre-signed URL for uploading
router.get('/sign', uploadsCtrl.getSignedUrl);

// POST /api/uploads/proxy - Upload file through the server
router.post('/proxy', upload.single('file'), uploadsCtrl.proxyUpload);

// GET /api/uploads/images/:userId/:imageId - Proxy image requests (no auth required)
router.get('/images/:userId/:imageId', uploadsCtrl.proxyImage);

module.exports = router;
