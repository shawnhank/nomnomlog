const RestaurantTag = require('../models/restaurantTag');
const Restaurant = require('../models/restaurant');

module.exports = {
  getAllForRestaurant,
  create,
  delete: deleteRestaurantTag,
  deleteAllForRestaurant
};

// Get all tags for a specific restaurant
async function getAllForRestaurant(req, res) {
  try {
    // First verify the restaurant belongs to the user
    const restaurant = await Restaurant.findOne({
      _id: req.params.restaurantId,
      userId: req.user._id
    });
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // Get all restaurant-tag relationships for this restaurant
    const restaurantTags = await RestaurantTag.find({ 
      restaurantId: req.params.restaurantId 
    }).populate('tagId');
    
    // Extract just the tags from the relationships
    const tags = restaurantTags.map(rt => rt.tagId);
    
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new restaurant-tag relationship
async function create(req, res) {
  try {
    // Verify the restaurant belongs to the user
    const restaurant = await Restaurant.findOne({
      _id: req.body.restaurantId,
      userId: req.user._id
    });
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    const restaurantTag = await RestaurantTag.create(req.body);
    res.status(201).json(restaurantTag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a restaurant-tag relationship
async function deleteRestaurantTag(req, res) {
  try {
    const restaurantTag = await RestaurantTag.findById(req.params.id);
    
    if (!restaurantTag) {
      return res.status(404).json({ error: 'Restaurant tag not found' });
    }
    
    // Verify the restaurant belongs to the user
    const restaurant = await Restaurant.findOne({
      _id: restaurantTag.restaurantId,
      userId: req.user._id
    });
    
    if (!restaurant) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await RestaurantTag.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant tag deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete all tags for a restaurant
async function deleteAllForRestaurant(req, res) {
  try {
    // Verify the restaurant belongs to the user
    const restaurant = await Restaurant.findOne({
      _id: req.params.restaurantId,
      userId: req.user._id
    });
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    await RestaurantTag.deleteMany({ restaurantId: req.params.restaurantId });
    res.json({ message: 'All restaurant tags deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}