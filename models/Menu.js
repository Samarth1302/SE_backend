const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemDescription: {
    type: String,
  },
  itemCategory: {
    type: String,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Menu", MenuSchema);
