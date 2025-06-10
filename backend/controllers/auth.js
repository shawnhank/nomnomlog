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
    // If fname and lname are provided but name isn't, create a name from them
    if (!req.body.name && (req.body.fname || req.body.lname)) {
      req.body.name = [req.body.fname, req.body.lname].filter(Boolean).join(' ');
    }
    
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Duplicate Email' });
  }
}

async function updateProfile(req, res) {
  try {
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }
    
    // Find the user by ID
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update only the fields that are provided in the request
    if (req.body.email) user.email = req.body.email;
    if (req.body.fname) user.fname = req.body.fname;
    if (req.body.lname) user.lname = req.body.lname;
    if (req.body.name) user.name = req.body.name;
    
    // If name isn't provided but fname or lname are, update the name
    if (!req.body.name && (req.body.fname || req.body.lname)) {
      const firstName = req.body.fname || user.fname || '';
      const lastName = req.body.lname || user.lname || '';
      user.name = [firstName, lastName].filter(Boolean).join(' ');
    }
    
    // Save the updated user
    await user.save();
    
    // Return a new token with the updated user info
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(400).json({ message: err.message || 'Failed to update profile' });
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
