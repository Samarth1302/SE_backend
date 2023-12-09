const mongoose = require("mongoose");
const Order = require("../models/Order");
const Sales = require("../models/Sales");

const calculateSalesData = async () => {
  try {
    const lastMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      //new Date().getMonth()-1,
      1,
      0,
      0,
      0
    );

    const currentMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      //new Date().getMonth(),
      1,
      0,
      0,
      0
    );

    const monthlySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastMonthStart,
            $lt: currentMonthStart,
          },
          status: "Completed",
          orderServedAt: { $ne: null },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          orderServedAt: 1,
          createdAt: 1,
        },
      },
    ]);

    const filteredMonthlySalesData = monthlySalesData.filter(
      (order) => order.orderServedAt !== null
    );

    await Sales.findOneAndUpdate(
      {
        month: lastMonthStart.getMonth() + 1,
        year: lastMonthStart.getFullYear(),
      },
      {
        $set: {
          totalSales: filteredMonthlySalesData.length
            ? filteredMonthlySalesData.reduce(
                (acc, order) => acc + order.totalAmount,
                0
              )
            : 0,
          avgOrderCompletionTime: filteredMonthlySalesData.length
            ? filteredMonthlySalesData.reduce(
                (acc, order) => acc + (order.orderServedAt - order.createdAt),
                0
              ) /
              filteredMonthlySalesData.length /
              1000
            : 0,
          numberOfOrdersMonthly: filteredMonthlySalesData.length,
          month: lastMonthStart.getMonth() + 1,
          year: lastMonthStart.getFullYear(),
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
