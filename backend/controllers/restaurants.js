const Restaurant = require('../models/restaurant');

module.exports = {
  create,
  index,
  show,
  update,
  delete: deleteRestaurant
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

async function index(req, res) {
  try {
    // Find restaurants for the logged-in user
    const restaurants = await Restaurant.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    res.json(restaurants);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function show(req, res) {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deleteRestaurant(req, res) {
  try {
    const restaurant = await Restaurant.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
