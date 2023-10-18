const Order = require("../models/Orders");

const orderResolver = {
  Query: {
    orders: async () => {
      try {
        const orders = await Order.find();
        return orders;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
  Mutation: {
    createOrder: async (_, { input }) => {
      try {
        const { customerName, items, totalAmount, status } = input;
        const newOrder = new Order({
          customerName,
          items,
          totalAmount,
          status,
        });
        const result = await newOrder.save();
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
};

module.exports = orderResolver;
