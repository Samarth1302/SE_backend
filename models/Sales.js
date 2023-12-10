const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  totalSales: {
    type: Number,
    required: true,
  },
  avgOrderCompletionTime: {
    type: Number,
    default: 0,
  },
  numberOfOrdersMonthly: {
    type: Number,
    default: 0,
  },
  topSellingItems: [
    {
      itemName: {
        type: String,
        required: true,
      },
      totalQuantity: {
        type: Number,
        required: true,
      },
    },
  ],
  avgOrderValue: {
    type: Number,
    default: 0,
  },
  bestSellingCategory: {
    type: String,
    default: null,
  },
  busyTime: {
    type: Number,
    default: 0,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Sales", SalesSchema);
