const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
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
});

module.exports = mongoose.model("Item", ItemSchema);
