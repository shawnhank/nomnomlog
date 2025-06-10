const Meal = require('../models/meal');
const MealTag = require('../models/mealTag');

module.exports = {
  getAll,
  getOne,
  create,
  update,
  delete: deleteMeal,
  toggleFavorite,
  setThumbsRating,
  getFavorites,
  getThumbsUp,
  getThumbsDown,
  getUnrated
};

// Get all meals for the logged-in user
async function getAll(req, res) {
  try {
    const meals = await Meal.find({ userId: req.user._id })
      .populate('restaurantId')
      .sort('-date');
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get one meal by ID
async function getOne(req, res) {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('restaurantId');
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new meal
async function create(req, res) {
  try {
    // Add the user ID to the meal
    req.body.userId = req.user._id;
    
    const meal = await Meal.create(req.body);
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Update a meal
async function update(req, res) {
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    res.json(meal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a meal
async function deleteMeal(req, res) {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    // Also delete any associated meal tags
    await MealTag.deleteMany({ mealId: req.params.id });
    
    res.json({ message: 'Meal deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Toggle favorite status
async function toggleFavorite(req, res) {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    // Toggle the favorite status
    meal.isFavorite = !meal.isFavorite;
    await meal.save();
    
    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Set thumbs rating
async function setThumbsRating(req, res) {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    // Set the thumbs rating based on request body
    meal.isThumbsUp = req.body.isThumbsUp;
    await meal.save();
    
    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all favorite meals
async function getFavorites(req, res) {
  try {
    const meals = await Meal.find({ 
      userId: req.user._id,
      isFavorite: true 
    }).populate('restaurantId').sort('-date');
    
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all thumbs up meals
async function getThumbsUp(req, res) {
  try {
    const meals = await Meal.find({ 
      userId: req.user._id,
      isThumbsUp: true 
    }).populate('restaurantId').sort('-date');
    
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all thumbs down meals
async function getThumbsDown(req, res) {
  try {
    const meals = await Meal.find({ 
      userId: req.user._id,
      isThumbsUp: false 
    }).populate('restaurantId').sort('-date');
    
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all unrated meals (no thumbs rating)
async function getUnrated(req, res) {
  try {
    const meals = await Meal.find({ 
      userId: req.user._id,
      isThumbsUp: null 
    }).populate('restaurantId').sort('-date');
    
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
