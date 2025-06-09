const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;

const userSchema = new Schema(
  {
    // Updated fields based on ERD
    fname: { type: String }, // Optional
    lname: { type: String }, // Optional
    name: { type: String, required: true }, // Keeping for backward compatibility
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    socialLoginId: { type: String }, // Optional, for social login integration
    isAdmin: { type: Boolean, default: false }, // For admin functionality
  },
  {
    timestamps: true,
    // Remove password when doc is sent across network
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  // 'this' is the user document
  if (!this.isModified('password')) return next();
  // Replace the password with the computed hash
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

module.exports = mongoose.model('User', userSchema);