// backend/src/models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, index: true },
  passwordHash: String,
  roles: [String], // e.g., ['CUSTOMER'], ['ADMIN']
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
