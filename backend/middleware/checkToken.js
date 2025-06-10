const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist');

module.exports = async function (req, res, next) {
  // Check for the token being sent in a header or as a query param
  let token = req.get('Authorization') || req.query.token;
  console.log('Auth header:', req.get('Authorization')); // Debug log
  
  // Default to null
  req.user = null;
  if (!token) {
    console.log('No token found'); // Debug log
    return next();
  }
  
  // Remove the 'Bearer ' that was included in the token header
  token = token.replace('Bearer ', '');
  
  // Remove any quotes that might be around the token
  token = token.replace(/^"(.*)"$/, '$1');
  
  console.log('Token after replace:', token.substring(0, 20) + '...'); // Debug log
  
  try {
    // Check if token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) return next();
    
    // Check if token is valid and not expired
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      // Invalid token if err
      if (err) return next();
      // decoded is the entire token payload
      req.user = decoded.user;
      // Store the token for potential blacklisting
      req.token = token;
      return next();
    });
  } catch (err) {
    console.error('Token verification error:', err);
    return next();
  }
};
