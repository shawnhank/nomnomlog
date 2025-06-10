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
    console.log(`Fetching restaurants for user: ${req.user._id}`);
    console.log('User object:', JSON.stringify(req.user));
    
    // Find restaurants for the logged-in user
    const restaurants = await Restaurant.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    
    console.log(`Found ${restaurants.length} restaurants`);
    
    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    
    console.log('Sending response');
    res.json(restaurants);
    console.log('Response sent');
  } catch (err) {
    console.error('Error in index controller:', err);
    res.status(500).json({ message: err.message });
  }
}

async function show(req, res) {
  try {
    console.log(`Fetching restaurant with ID: ${req.params.id} for user: ${req.user._id}`);
    
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!restaurant) {
      console.log('Restaurant not found');
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    console.log('Restaurant found, sending response');
    
    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    
    res.json(restaurant);
  } catch (err) {
    console.error('Error in show controller:', err);
    res.status(500).json({ message: err.message });
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
