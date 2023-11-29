const mongoose = require("mongoose");
const Order = require("../models/Order");
const Sales = require("../models/Sales");

const calculateSalesData = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlySalesData = await Order.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$createdAt" }, currentMonth] },
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
      { month: currentMonth, year: currentYear },
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
          month: currentMonth,
          year: currentYear,
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
