const User = require("../models/User");

const userResolver = {
  Query: {
    users: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
  Mutation: {
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
  },
};

module.exports = userResolver;
