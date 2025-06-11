const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantTagSchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
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

// Compound index to ensure a restaurant can't have the same tag twice
restaurantTagSchema.index({ restaurantId: 1, tagId: 1 }, { unique: true });

module.exports = mongoose.model('RestaurantTag', restaurantTagSchema);
