const Menu = require("./models/Menu");
const User = require("./models/User");
const Order = require("./models/Orders");

const resolver = {
  Query: {
    menu: async () => {
      try {
        const menu = await Menu.find();
        return menu;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    users: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
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
    createMenuItem: async (_, { input }) => {
      try {
        const { itemName, itemDescription, itemPrice } = input;
        const newMenuItem = new Menu({
          itemName,
          itemDescription,
          itemPrice,
        });
        const result = await newMenuItem.save();
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    addUser: async (_, { name, role }) => {
      try {
        const user = new User({
          name,
          role,
        });
        await user.save();
        return user;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
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
