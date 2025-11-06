// backend/src/schema/typeDefs.js
const { gql } = require('graphql-tag');

const typeDefs = gql`
  scalar DateTime

  type Category {
    id: ID!
    name: String!
    slug: String
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    inStock: Boolean!
    category: Category
    createdAt: DateTime
  }

  type User {
    id: ID!
    name: String
    email: String!
    roles: [String]!
    createdAt: DateTime
  }

  type OrderItem {
    product: Product
    quantity: Int
    priceAtPurchase: Float
  }

  type Order {
    id: ID!
    user: User
    items: [OrderItem]!
    total: Float
    status: String
    createdAt: DateTime
  }

  type Query {
    hello: String
    products(limit: Int, offset: Int, search: String): [Product]!
    product(id: ID!): Product
    categories: [Category]!
    me: User
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    register(name: String, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    createCategory(name: String!, slug: String): Category
    createProduct(name: String!, description: String, price: Float!, inStock: Boolean, categoryId: ID): Product
  }
`;

module.exports = typeDefs;
