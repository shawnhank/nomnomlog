const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenBlacklistSchema = new Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Create a TTL index that automatically removes documents after they expire
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);