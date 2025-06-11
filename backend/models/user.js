const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;

const userSchema = new Schema(
  {
    // New field for the simplified name approach
    fullName: { 
      type: String, 
      required: true 
    },
    // Keep these temporarily for migration
    fname: { type: String }, // Will be deprecated
    lname: { type: String }, // Will be deprecated
    name: { type: String }, // Keeping for backward compatibility
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

// Add a virtual to handle migration from fname/lname to fullName
// TODO: Remove this virtual after migration to fullName is complete for all users
userSchema.virtual('displayName').get(function() {
  // Prioritize fullName if it exists
  if (this.fullName) return this.fullName;
  
  // Fall back to name if it exists
  if (this.name) return this.name;
  
  // Last resort: combine fname and lname if they exist
  if (this.fname || this.lname) {
    return [this.fname, this.lname].filter(Boolean).join(' ');
  }
  
  // If nothing else, return email
  return this.email;
});

userSchema.pre('save', async function (next) {
  // 'this' is the user document
  if (!this.isModified('password')) return next();
  // Replace the password with the computed hash
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

module.exports = mongoose.model('User', userSchema);
