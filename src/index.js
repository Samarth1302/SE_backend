const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const context = require("../middleware/auth");
const mongoose = require("mongoose");
require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    return startStandaloneServer(server, {
      listen: { port: process.env.PORT },
      context: context,
    });
  })
  .then((server) => {
    console.log(`🚀  Server ready at: ${server.url}`);
  });
