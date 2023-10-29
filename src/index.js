const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");

    const { url } = await startStandaloneServer(server, {
      context: async ({ req }) => ({ req }),
      listen: { port: PORT },
    });
    console.log(`Server running at ${url}`);
  } catch (error) {
    console.error("Server error: ", error);
  }
}

startServer();
