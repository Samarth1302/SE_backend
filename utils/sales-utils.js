const mongoose = require("mongoose");
const Sales = require("../models/Sales");

const calculateSalesData = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlySalesData = await Sales.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$date" }, currentMonth] },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalSales" },
          avgOrderCompletionTime: { $avg: "$avgOrderCompletionTime" },
          numberOfOrders: { $sum: "$numberOfOrdersMonthly" },
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
