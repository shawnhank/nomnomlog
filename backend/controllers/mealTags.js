const MealTag = require('../models/mealTag');
const Meal = require('../models/meal');

module.exports = {
  getAllForMeal,
  create,
  delete: deleteMealTag,
  deleteByMealAndTag,
  deleteAllForMeal
};

// Get all tags for a specific meal
async function getAllForMeal(req, res) {
  try {
    const mealTags = await MealTag.find({
      mealId: req.params.mealId,
      userId: req.user._id
    }).populate('tagId');
    
    res.json(mealTags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new meal-tag relationship
async function create(req, res) {
  try {
    // Verify the meal belongs to the user
    const meal = await Meal.findOne({
      _id: req.body.mealId,
      userId: req.user._id
    });
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    // Add the user ID to the meal tag
    req.body.userId = req.user._id;
    
    const mealTag = await MealTag.create(req.body);
    res.status(201).json(mealTag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a meal-tag relationship by ID
async function deleteMealTag(req, res) {
  try {
    const mealTag = await MealTag.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!mealTag) {
      return res.status(404).json({ error: 'Meal tag not found' });
    }
    
    res.json({ message: 'Meal tag deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a meal-tag relationship by meal ID and tag ID
async function deleteByMealAndTag(req, res) {
  try {
    const mealTag = await MealTag.findOneAndDelete({
      mealId: req.params.mealId,
      tagId: req.params.tagId,
      userId: req.user._id
    });
    
    if (!mealTag) {
      return res.status(404).json({ error: 'Meal tag relationship not found' });
    }
    
    res.json({ message: 'Meal tag deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete all tags for a meal
async function deleteAllForMeal(req, res) {
  try {
    const result = await MealTag.deleteMany({
      mealId: req.params.mealId,
      userId: req.user._id
    });
    
    res.json({ 
      message: `${result.deletedCount} meal tags deleted`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
