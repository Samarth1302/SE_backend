const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Preparing",
      "Prepared",
      "Served",
      "Completed",
      "Cancelled",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orderApprovedAt: {
    type: Date,
    default: null,
  },
  orderCompletedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
