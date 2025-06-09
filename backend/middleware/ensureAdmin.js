module.exports = function(req, res, next) {
  // Check if user is an admin
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }
  // If they are an admin, allow the request to proceed
  next();
};