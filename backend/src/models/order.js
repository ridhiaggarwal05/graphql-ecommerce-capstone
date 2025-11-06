// backend/src/models/Order.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  priceAtPurchase: Number
}, { _id: false });

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  items: [OrderItemSchema],
  total: Number,
  status: { type: String, default: 'PENDING', index: true }, // PENDING/PAID/SHIPPED/CANCELLED
  createdAt: { type: Date, default: Date.now, index: true }
});

OrderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
