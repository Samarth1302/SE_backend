const Menu = require("./models/Menu");
const User = require("./models/User");
const Order = require("./models/Orders");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const resolver = {
  Query: {
    me: async (_, { user }) => {
      if (!user) {
        throw new Error("You are not authenticated!");
      }
      return await User.findById(user.id);
    },

    menu: async () => {
      try {
        const menu = await Menu.find();
        return menu;
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
        const { itemName, itemDescription, itemCategory, itemPrice } = input;
        const newMenuItem = new Menu({
          itemName,
          itemDescription,
          itemCategory,
          itemPrice,
        });
        const result = await newMenuItem.save();
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    signup: async (_, { username, email, password, role }) => {
      try {
        const user = await User.create({
          username,
          email,
          password: await bcrypt.hash(password, 10),
          role,
        });
        return user;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("No user with that email");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Incorrect password");
      }
      return jsonwebtoken.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
    },
    createOrder: async (_, { input }) => {
      try {
        const { customerID, items, totalAmount, status } = input;
        const newOrder = new Order({
          customerID,
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
