const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  signUp,
  logIn,
  updateProfile,
  changePassword
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
    // Allow updating name, fname, lname, and email
    const updates = {
      name: req.body.name,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email
    };
    
    // If fname or lname changed but name wasn't provided, update name
    if (!updates.name && (updates.fname || updates.lname)) {
      const user = await User.findById(req.user._id);
      const firstName = updates.fname || user.fname || '';
      const lastName = updates.lname || user.lname || '';
      updates.name = [firstName, lastName].filter(Boolean).join(' ');
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );
    
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
    
    // Return success message
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(400).json({ message: err.message || 'Failed to change password' });
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