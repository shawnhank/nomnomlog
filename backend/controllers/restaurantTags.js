const RestaurantTag = require('../models/restaurantTag');
const Restaurant = require('../models/restaurant');

module.exports = {
  getAllForRestaurant,
  create,
  delete: deleteRestaurantTag,
  deleteByRestaurantAndTag,
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
      restaurantId: req.params.restaurantId,
      userId: req.user._id
    }).populate('tagId');
    
    res.json(restaurantTags);
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
    
    // Add the user ID to the restaurant tag
    req.body.userId = req.user._id;
    
    const restaurantTag = await RestaurantTag.create(req.body);
    res.status(201).json(restaurantTag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a restaurant-tag relationship by ID
async function deleteRestaurantTag(req, res) {
  try {
    const restaurantTag = await RestaurantTag.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!restaurantTag) {
      return res.status(404).json({ error: 'Restaurant tag not found' });
    }
    
    res.json({ message: 'Restaurant tag deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a restaurant-tag relationship by restaurant ID and tag ID
async function deleteByRestaurantAndTag(req, res) {
  try {
    const restaurantTag = await RestaurantTag.findOneAndDelete({
      restaurantId: req.params.restaurantId,
      tagId: req.params.tagId,
      userId: req.user._id
    });
    
    if (!restaurantTag) {
      return res.status(404).json({ error: 'Restaurant tag relationship not found' });
    }
    
    res.json({ message: 'Restaurant tag deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    
    const result = await RestaurantTag.deleteMany({ 
      restaurantId: req.params.restaurantId,
      userId: req.user._id
    });
    
    res.json({ 
      message: `${result.deletedCount} restaurant tags deleted`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
