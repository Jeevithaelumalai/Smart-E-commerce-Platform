const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  imageUrl: String,
  stock: { type: Number, default: 0 },
  embedding: { type: [Number], select: false }, // For recommendation vectors
  createdAt: { type: Date, default: Date.now }
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
