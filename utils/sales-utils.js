const mongoose = require("mongoose");
const Order = require("../models/Order");
const Sales = require("../models/Sales");

const calculateSalesData = async () => {
  try {
    const currentMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const lastMonthEnd = new Date(currentMonthStart);
    lastMonthEnd.setDate(0);

    const monthlySalesData = await Order.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $gte: ["$createdAt", lastMonthEnd] },
              { $lt: ["$createdAt", currentMonthStart] },
            ],
          },
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          avgOrderCompletionTime: {
            $avg: {
              $subtract: ["$orderServedAt", "$createdAt"],
            },
          },
          numberOfOrders: { $sum: 1 },
        },
      },
    ]);

    await Sales.findOneAndUpdate(
      { month: lastMonthEnd.getMonth() + 1, year: lastMonthEnd.getFullYear() },
      {
        $set: {
          totalSales: monthlySalesData.length
            ? monthlySalesData[0].totalSales
            : 0,
          avgOrderCompletionTime: monthlySalesData.length
            ? monthlySalesData[0].avgOrderCompletionTime
            : 0,
          numberOfOrdersMonthly: monthlySalesData.length
            ? monthlySalesData[0].numberOfOrders
            : 0,
          month: lastMonthEnd.getMonth() + 1,
          year: lastMonthEnd.getFullYear(),
        },
      },
      { upsert: true }
    );

    console.log("Monthly sales data updated successfully.");
  } catch (error) {
    console.error("Error updating monthly sales data:", error);
  }
};

module.exports = { calculateSalesData };
