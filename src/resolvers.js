const Item = require("../models/Item");
const User = require("../models/User");
const Order = require("../models/Order");
const { GraphQLError } = require("graphql");
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

      const oldUname = await User.findOne({ username });
      if (oldUname)
        throw new GraphQLError("User with same username already exists", {
          extensions: {
            code: "USERNAME_ALREADY_EXISTS",
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
          {
            user_id: user._id,
            username: user.username.toLowerCase(),
            email: user.email,
            role: user.role,
          },
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
        throw new GraphQLError("Can't find such user. Signup first", {
          extensions: {
            code: "USER_NOT_FOUND",
          },
        });
      } else if (await bcrypt.compare(password, user.password)) {
        if (user.role === "customer") {
          const token = jwt.sign(
            {
              user_id: user._id,
              username: user.username.toLowerCase(),
              email: user.email,
              role: user.role,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          );
          user.token = token;
        } else {
          const token = jwt.sign(
            {
              user_id: user._id,
              username: user.username.toLowerCase(),
              email: user.email,
              role: user.role,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
            }
          );
          user.token = token;
        }
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
          throw new GraphQLError("Only admins can add items to the menu", {
            extensions: {
              code: "ACTION_FORBIDDEN",
            },
          });
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
        throw new GraphQLError(
          "Item couldn't be added to menu. Check if any field is empty",
          {
            extensions: {
              code: "ITEM_NOT_ADDED",
            },
          }
        );
      }
    },
    placeOrder: async (
      _,
      { orderInput: { customerName, items, totalAmount } },
      contextValue
    ) => {
      const user = contextValue.user;
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
          customerName: customerName,
          items: items,
          totalAmount: totalAmount,
          status: "Pending",
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
    registerEmployee: async (
      _,
      { signupInput: { username, email, password } },
      contextValue
    ) => {
      const adminUser = contextValue.user;

      try {
        if (adminUser.role !== "admin") {
          throw new GraphQLError("Only admins can register employees", {
            extensions: {
              code: "ACTION_FORBIDDEN",
            },
          });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new GraphQLError("User with the same email already exists", {
            extensions: {
              code: "USER_ALREADY_EXISTS",
            },
          });
        }
        const encryptedPassword = await bcrypt.hash(password, 10);

        const employee = new User({
          username,
          email: email.toLowerCase(),
          password: encryptedPassword,
          role: "employee",
        });
        const res = await employee.save();

        return {
          id: res.id,
          ...res._doc,
        };
      } catch (err) {
        throw new GraphQLError("Employee registration failed", {
          extensions: {
            code: "EMPLOYEE_REGISTRATION_ERROR",
          },
        });
      }
    },

    changeOrderStatus: async (_, { orderId, newStatus }, contextValue) => {
      const user = contextValue.user;

      try {
        if (user.role !== "admin" && user.role !== "employee") {
          throw new GraphQLError("Only admins/employees can confirm orders", {
            extensions: {
              code: "ACTION_FORBIDDEN",
            },
          });
        }

        const order = await Order.findById(orderId);
        if (!order) {
          throw new GraphQLError("Order not found", {
            extensions: {
              code: "ORDER_NOT_FOUND",
            },
          });
        }
        if (newStatus === "Preparing" && order.status !== "Preparing") {
          order.status = "Preparing";
          order.orderApprovedAt = new Date().toISOString();
        } else if (newStatus === "Completed" && order.status !== "Completed") {
          order.status = "Completed";
          order.orderCompletedAt = new Date().toISOString();
        }
        const res = await order.save();
        return {
          id: res.id,
          ...res._doc,
        };
      } catch (err) {
        throw new GraphQLError("Order status update failed", {
          extensions: {
            code: "ORDER_UPDATION_ERROR",
          },
        });
      }
    },
  },

  Query: {
    allItems: async (_) => {
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
    userOrders: async (_, __, contextValue) => {
      const user = contextValue.user;
      try {
        if (user.role === "customer") {
          const userOrders = await Order.find({ customerName: user.username });
          return userOrders;
        } else {
          const userOrders = await Order.find();
          return userOrders;
        }
      } catch (err) {
        throw new GraphQLError("Error fetching user orders", {
          extensions: {
            code: "FETCH_USER_ORDERS_ERROR",
          },
        });
      }
    },
    findOrder: async (_, { orderId }, __) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new GraphQLError("Order not found", {
            extensions: {
              code: "ORDER_NOT_FOUND",
            },
          });
        }
        return order;
      } catch (err) {
        throw new GraphQLError("Error finding order", {
          extensions: {
            code: "FIND_ORDER_ERROR",
          },
        });
      }
    },
  },
};

module.exports = resolvers;
