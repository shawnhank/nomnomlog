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

const restaurantSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: String,
  phone: String,
  website: String,
  lat: Number,
  long: Number,
  
  // Updated with more specific field name
  restaurantImages: [imageSchema],
  
  // Replace isFavorite with isThumbsUp as tri-state
  isThumbsUp: {
    type: Boolean,
    default: null
  }
}, {
  timestamps: true
});

// Update index for efficient queries on isThumbsUp
restaurantSchema.index({ isThumbsUp: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
