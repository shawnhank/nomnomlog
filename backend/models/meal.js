const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the image schema with timestamps
const imageSchema = new Schema({
  url: { 
    type: String, 
    required: true 
  },
  isPrimary: { 
    type: Boolean, 
    default: false 
  },
  caption: { 
    type: String, 
    default: '' 
  }
}, { 
  timestamps: true
});

const mealSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  
  // Updated with more specific field name
  mealImages: [imageSchema],
  
  // Keep imageUrl temporarily for backward compatibility
  imageUrl: {
    type: String
  },
  
  isFavorite: {
    type: Boolean,
    default: false
  },
  isThumbsUp: {
    type: Boolean,
    default: null
  }
}, {
  timestamps: true
});

// Add index for efficient queries on isFavorite
mealSchema.index({ isFavorite: 1 });

module.exports = mongoose.model('Meal', mealSchema);
