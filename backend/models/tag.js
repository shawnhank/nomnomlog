const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can't have duplicate tag names
tagSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Tag', tagSchema);