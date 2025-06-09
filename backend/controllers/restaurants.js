const Restaurant = require('../models/restaurant');

module.exports = {
  create
};

async function create(req, res) {
  try {
    // Add the user ID to the restaurant data
    req.body.userId = req.user._id;
    const restaurant = await Restaurant.create(req.body);
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}