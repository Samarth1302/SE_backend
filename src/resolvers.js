const Item = require("../models/Item");
const User = require("../models/User");
const Order = require("../models/Order");
const { GraphQLError } = require("graphql");
const authenticate = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const resolvers = {
  Mutation: {
    signup: async (_, { signupInput: { username, email, password } }) => {
      const oldUser = await User.findOne({ email });
      if (oldUser)
        throw new GraphQLError("User with same email already exists", {
          extensions: {
            code: "USER_ALREADY_EXISTS",
          },
        });

      try {
        var encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          username: username,
          email: email.toLowerCase(),
          password: encryptedPassword,
        });

        const token = jwt.sign(
          { user_id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        user.token = token;
        const res = await user.save();

        return {
          id: res.id,
          ...res._doc,
        };
      } catch (err) {
        throw new GraphQLError("User couldn't be saved to system", {
          extensions: {
            code: "USER_NOT_SAVED",
          },
        });
      }
    },
    login: async (_, { loginInput: { email, password } }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError("Can't find such user", {
          extensions: {
            code: "USER_NOT_FOUND",
          },
        });
      } else if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { user_id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        user.token = token;

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        throw new GraphQLError("Incorrect Password", {
          extensions: {
            code: "INCORRECT_PASSWORD",
          },
        });
      }
    },
    addItem: async (
      _,
      { itemInput: { itemName, itemDesc, itemImage, itemGrp, itemPrice } },
      contextValue
    ) => {
      const user = contextValue.user;
      const oldItem = await Item.findOne({ itemName });
      if (oldItem)
        throw new GraphQLError("Item with same name already exists", {
          extensions: {
            code: "ITEM_EXISTS",
          },
        });

      try {
        if (user.role !== "admin") {
          throw new GraphQLError(
            "Only admins can add items to the menu Password",
            {
              extensions: {
                code: "ACTION_FORBIDDEN",
              },
            }
          );
        }
        const item = new Item({
          itemName: itemName,
          itemDesc: itemDesc,
          itemImage: itemImage,
          itemGrp: itemGrp,
          itemPrice: itemPrice,
        });
        const res = await item.save();
        return {
          id: res.id,
          ...res._doc,
        };
      } catch (err) {
        throw new GraphQLError("Item couldn't be added to menu", {
          extensions: {
            code: "ITEM_NOT_ADDED",
          },
        });
      }
    },
    placeOrder: async (_, { orderInput }, contextValue) => {
      const user = authenticate(contextValue);

      try {
        const existingUser = await User.findOne({ _id: user.user_id });
        if (!existingUser) {
          throw new GraphQLError("Users need to login first", {
            extensions: {
              code: "USER_NOT_LOGGEDIN",
            },
          });
        }
        const order = new Order({
          userID: user.user_id,
          customerName: orderInput.customerName,
          items: orderInput.items,
          totalAmount: orderInput.totalAmount,
          status: orderInput.status || "pending",
          createdAt: new Date().toISOString(),
        });

        const res = await order.save();

        return {
          id: res.id,
          ...res._doc,
        };
      } catch (err) {
        throw new GraphQLError("Order couldn't be placed", {
          extensions: {
            code: "ORDER_NOT_PLACED",
          },
        });
      }
    },
  },
  Query: {
    user: async (_, { email }, contextValue) => {
      try {
        const user = await User.findOne({ email });
        return user;
      } catch (err) {
        throw new GraphQLError("Error finding the user", {
          extensions: {
            code: "USER_NOT_FOUND",
          },
        });
      }
    },
    allItems: async (_, args) => {
      try {
        const allItems = await Item.find();
        return allItems;
      } catch (err) {
        throw new GraphQLError("Error fetching items", {
          extensions: {
            code: "FETCH_ERROR",
          },
        });
      }
    },
  },
};

module.exports = resolvers;
