const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealTagSchema = new Schema({
  mealId: {
    type: Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  tagId: {
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a meal can't have the same tag twice
mealTagSchema.index({ mealId: 1, tagId: 1 }, { unique: true });

module.exports = mongoose.model('MealTag', mealTagSchema);
