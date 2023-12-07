const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const context = require("../middleware/auth");
const mongoose = require("mongoose");
const { cleanOrders } = require("../utils/order-utils");
const { calculateSalesData } = require("../utils/sales-utils");
const cron = require("node-cron");
require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // cors: {
  //   origin: "http://localhost:3000/",
  //   credentials: true,
  // },
});
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    cron.schedule("0 0 * * *", () => {
      cleanOrders();
    });
    cron.schedule("0 0 0 1 * *", () => {
      calculateSalesData();
    });

    return startStandaloneServer(server, {
      listen: { port: process.env.PORT },
      context: context,
    });
  })
  .then((server) => {
    console.log(`🚀  Server ready at: ${server.url}`);
  });
