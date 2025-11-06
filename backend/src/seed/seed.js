// backend/src/seed/seed.js
require('dotenv').config();
const connectDB = require('../config/db');
const Category = require('../models/category');
const Product = require('../models/product');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

async function seed() {
  await connectDB();

  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({})
  ]);

  const clothing = await Category.create({ name: 'Clothing', slug: 'clothing' });
  const electronics = await Category.create({ name: 'Electronics', slug: 'electronics' });

  await Product.create([
    { name: 'T-shirt', description: 'Soft cotton tee', price: 299, inStock: true, categoryId: clothing._id },
    { name: 'Headphones', description: 'Noise cancelling', price: 1299, inStock: true, categoryId: electronics._id }
  ]);

  const adminHash = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Admin', email: 'admin@example.com', passwordHash: adminHash, roles: ['ADMIN'] });

  console.log('✅ Seed complete. Admin: admin@example.com / admin123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
