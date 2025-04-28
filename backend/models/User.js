const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchaseHistory: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, min: 1, max: 5 },
    timestamp: { type: Date, default: Date.now }
  }],
  browsingHistory: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    timestamp: { type: Date, default: Date.now }
  }],
  preferences: {
    categories: [String],
    priceRange: {
      min: Number,
      max: Number
    }
  }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);