const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemDescription: {
    type: String,
  },
  itemImage: { data: Buffer, contentType: String },
  itemCategory: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Item", ItemSchema);
