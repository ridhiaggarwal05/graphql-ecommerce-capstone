// backend/src/models/Product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true, index: true },
  description: String,
  price: { type: Number, required: true, index: true },
  inStock: { type: Boolean, default: true, index: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  createdAt: { type: Date, default: Date.now, index: true }
});

ProductSchema.index({ categoryId: 1, price: 1, createdAt: -1 });

module.exports = mongoose.model('Product', ProductSchema);
