const Product = require("../models/product");
const Category = require("../models/category");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    hello: () => "Hello Ridhi! GraphQL is running 🎉",
    products: async (_, { limit = 10, offset = 0, search }) => {
      const filter = search ? { name: { $regex: search, $options: "i" } } : {};
      const products = await Product.find(filter).skip(offset).limit(limit).lean();
      return products.map((p) => ({
        id: p._id.toString(),
        ...p,
      }));
    },
    product: async (_, { id }) => {
      const p = await Product.findById(id).lean();
      return p ? { id: p._id.toString(), ...p } : null;
    },
    categories: async () => {
      const cats = await Category.find().lean();
      return cats.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
      }));
    },
    me: async (_, __, { user }) => user || null,
  },

  Product: {
    category: async (parent) => {
      if (!parent.categoryId) return null;
      return Category.findById(parent.categoryId).lean();
    },
  },

  Mutation: {
    register: async (_, { name, email, password }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("Email already in use");
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        passwordHash,
        roles: ["CUSTOMER"],
      });
      const token = signToken(user);
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) throw new Error("Invalid credentials");
      const token = signToken(user);
      return { token, user };
    },

    createCategory: async (_, { name, slug }) => {
      const cat = await Category.create({ name, slug });
      return { id: cat._id.toString(), ...cat.toObject() };
    },

    createProduct: async (
      _,
      { name, description, price, inStock = true, categoryId }
    ) => {
      const prod = await Product.create({
        name,
        description,
        price,
        inStock,
        categoryId,
      });
      return { id: prod._id.toString(), ...prod.toObject() };
    },
  },
};

module.exports = resolvers;
