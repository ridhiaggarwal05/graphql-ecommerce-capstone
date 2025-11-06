// backend/src/index.js
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const cors = require('cors');
// const bodyParser = require('body-parser');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const connectDB = require('./config/db');
const { getUserFromToken } = require('./utils/auth');

async function startServer() {
  await connectDB();
  const app = express();

  app.use(cors({ origin: "http://localhost:3000" }));
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = await getUserFromToken(token);
      return { user };
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;

  const httpServer = http.createServer(app);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();
