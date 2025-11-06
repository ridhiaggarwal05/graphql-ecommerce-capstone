// backend/src/utils/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

async function getUserFromToken(token) {
  try {
    if (!token) return null;
    const t = token.replace('Bearer ', '');
    const payload = jwt.verify(t, JWT_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user) return null;
    user.roles = payload.roles || user.roles;
    return user;
  } catch {
    return null;
  }
}

function signToken(user) {
  return jwt.sign({ sub: user._id, roles: user.roles || [] }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { getUserFromToken, signToken };
