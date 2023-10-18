const Menu = require("../models/Menu");

const menuResolver = {
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
  },
};

module.exports = menuResolver;
