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
  itemImage: { data: Buffer, contentType: String },
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
    default: NULL,
  },
});

module.exports = mongoose.model("Item", ItemSchema);
