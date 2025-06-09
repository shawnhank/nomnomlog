const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  website: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);