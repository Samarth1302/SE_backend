const Item = require("../models/Item");
const User = require("../models/User");
const Order = require("../models/Orders");
const { ApolloError } = require("apollo-server-errors");
const { authenticate } = require("../middleware/auth");
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
          { user_id: user._id, email: user.email, role: user.role },
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
        throw new ApolloError(
          "User couldn't be saved to system",
          "USER_NOT_SAVED"
        );
      }
    },
    login: async (_, { loginInput: { email, password } }) => {
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user._id, email: user.email, role: user.role },
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
    addItem: async (
      _,
      { itemInput: { itemName, itemDesc, itemImage, itemGrp, itemPrice } }
    ) => {
      await user.authenticate();
      const oldItem = await Item.findOne({ itemName });
      if (oldItem)
        throw new ApolloError(
          "Item with same name already exists",
          "ITEM_EXISTS"
        );
      try {
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
        console.error(err);
        throw new ApolloError(
          "Item couldn't be added to menu",
          "ITEM_NOT_ADDED"
        );
      }
    },
  },
  Query: {
    user: (_, { email }) => User.findById(email),
    item: (_, { itemName }) => Item.findById(itemName),
  },
};

module.exports = resolvers;
