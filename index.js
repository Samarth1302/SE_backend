const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const userSchema = require("./schema/userSchema.graphql");
const orderSchema = require("./schema/orderSchema.graphql");
const menuSchema = require("./schema/menuSchema.graphql");
const userResolver = require("./resolver/userResolver");
const orderResolver = require("./resolver/orderResolver");
const menuResolver = require("./resolver/menuResolver");
const connectDB = require("./config/database");

const mergedTypeDefs = mergeTypeDefs([userSchema, orderSchema, menuSchema]);
const mergedResolvers = mergeResolvers([
  userResolver,
  orderResolver,
  menuResolver,
]);

const schema = makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
});

const server = new ApolloServer({
  schema,
});

const app = express();
server.applyMiddleware({ app });
connectDB();

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
