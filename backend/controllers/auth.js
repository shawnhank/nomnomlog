const User = require('../models/user');
const TokenBlacklist = require('../models/tokenBlacklist');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  signUp,
  logIn,
  updateProfile,
  changePassword,
  logOut
};

async function logIn(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Bad Credentials' });
  }
}

async function signUp(req, res) {
  try {
    // Create a new user with the fullName field
    const userData = { ...req.body };
    
    // For backward compatibility - if fullName is provided but name isn't, copy fullName to name
    if (userData.fullName && !userData.name) {
      userData.name = userData.fullName;
    }
    
    const user = await User.create(userData);
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Duplicate Email' });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Update fullName if provided
    if (req.body.fullName) {
      user.fullName = req.body.fullName;
      // Also update name for backward compatibility
      user.name = req.body.fullName;
    }
    
    // Update email if provided
    if (req.body.email) user.email = req.body.email;
    
    // Migration: If user doesn't have fullName but has fname/lname, create fullName
    if (!user.fullName && (user.fname || user.lname)) {
      user.fullName = [user.fname, user.lname].filter(Boolean).join(' ');
    }
    
    await user.save();
    
    // Create a new token with the updated user info
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to update profile' });
  }
}

async function changePassword(req, res) {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if current password is correct
    const match = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update to new password
    user.password = req.body.newPassword;
    await user.save();
    
    // Blacklist the current token
    const token = req.token;
    const decoded = jwt.decode(token);
    const expiryDate = new Date(decoded.exp * 1000);
    
    await TokenBlacklist.create({
      token: token,
      user: req.user._id,
      expiresAt: expiryDate
    });
    
    // Return success message
    res.json({ 
      message: 'Password updated successfully. Please log in with your new password.',
      requireRelogin: true
    });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(400).json({ message: err.message || 'Failed to change password' });
  }
}

async function logOut(req, res) {
  try {
    // Extract token from authorization header or from the middleware
    const token = req.token;
    
    // Decode token to get expiration time
    const decoded = jwt.decode(token);
    const expiryDate = new Date(decoded.exp * 1000);
    
    // Add token to blacklist
    await TokenBlacklist.create({
      token: token,
      user: req.user._id,
      expiresAt: expiryDate
    });
    
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(400).json({ message: 'Logout failed' });
  }
}

// Helper function to create JWT
function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}
