const Order = require("../models/Order");

const cleanOrders = async () => {
  try {
    await Order.updateMany(
      {
        status: "Pending",
      },
      { $set: { status: "Cancelled" } }
    );

    await Order.deleteMany({ status: "Cancelled" });

    console.log("Orders cleaned successfully.");
  } catch (error) {
    console.error("Error cleaning orders:", error);
  }
};

module.exports = { cleanOrders };
