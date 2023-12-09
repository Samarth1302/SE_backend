const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    unique: true,
  },
  itemDesc: {
    type: String,
  },
  itemImage: { type: String, required: true },
  itemGrp: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  itemRtng: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Item", ItemSchema);
