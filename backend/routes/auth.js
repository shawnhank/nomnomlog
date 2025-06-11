const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/auth'

// Public routes
router.post('/signup', authCtrl.signUp);
router.post('/login', authCtrl.logIn);

// Protected routes - require authentication
router.put('/profile', ensureLoggedIn, authCtrl.updateProfile);
router.put('/password', ensureLoggedIn, authCtrl.changePassword);
router.post('/logout', ensureLoggedIn, authCtrl.logOut);

// Add these routes for password reset
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password/:token', authCtrl.resetPassword);

module.exports = router;
