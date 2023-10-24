const Menu = require("./models/Menu");
const User = require("./models/User");
const Order = require("./models/Orders");
const { ApolloError } = require("apollo-server-errors");
const { authenticate } = require("./middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const resolvers = {
  Mutation: {
    async signup(_, { signupInput: { username, email, password, role } }) {
      const oldUser = await User.findOne({ email });
      if (oldUser)
        throw new ApolloError(
          "User with same email already exists",
          "USER_ALREADY_EXISTS"
        );
      try {
        var encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          username: username,
          email: email.toLowerCase(),
          password: encryptedPassword,
          role: role,
        });

        const token = jwt.sign(
          { user_id: user._id, email, role },
          process.env.JWT_SECRET,
          {
            expiresIn: "10h",
          }
        );
        user.token = token;
        const res = await user.save();

        return {
          id: res.id,
          ...res._doc,
        };
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    login: async (_, { loginInput: { email, password } }) => {
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user._id, email, role },
          process.env.JWT_SECRET,
          {
            expiresIn: "10h",
          }
        );

        user.token = token;

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        throw new ApolloError("Incorrect Password", "INCORRECT_PASSWORD");
      }
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
  Query: {
    user: (_, { ID }) => User.findById(ID),

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
};
