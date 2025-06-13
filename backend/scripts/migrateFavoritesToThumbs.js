const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');
const Meal = require('../models/meal');
require('dotenv').config();

async function migrateFavoritesToThumbs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Migrate restaurant favorites to thumbs up
    console.log('Migrating restaurant favorites to thumbs up...');
    const restaurantResult = await Restaurant.updateMany(
      { isFavorite: true },
      { $set: { isThumbsUp: true } }
    );
    console.log(`Updated ${restaurantResult.modifiedCount} restaurants`);

    // Migrate meal favorites to thumbs up (if they don't already have a thumbs rating)
    console.log('Migrating meal favorites to thumbs up...');
    const mealResult = await Meal.updateMany(
      { isFavorite: true, isThumbsUp: null },
      { $set: { isThumbsUp: true } }
    );
    console.log(`Updated ${mealResult.modifiedCount} meals`);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

migrateFavoritesToThumbs();