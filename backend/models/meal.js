const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
