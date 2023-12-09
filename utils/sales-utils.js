const mongoose = require("mongoose");
const Order = require("../models/Order");
const Sales = require("../models/Sales");
const Item = require("../models/Item");

const calculateSalesData = async () => {
  try {
    const now = new Date();
    const lastMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0
    );
    const currentMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
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
          items: 1,
        },
      },
    ]);

    const topSellingItems = await Order.aggregate([
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
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    const filteredMonthlySalesData = monthlySalesData.filter(
      (order) => order.orderServedAt !== null
    );

    const averageOrderValue =
      filteredMonthlySalesData.length > 0
        ? filteredMonthlySalesData.reduce(
            (acc, order) => acc + order.totalAmount,
            0
          ) / filteredMonthlySalesData.length
        : 0;

    const bestSellingCategory = await Order.aggregate([
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
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "items",
          localField: "items.name",
          foreignField: "itemName",
          as: "itemDetails",
        },
      },
      {
        $unwind: "$itemDetails",
      },
      {
        $group: {
          _id: "$itemDetails.itemGrp",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 },
    ]);

    const busyTime = calculateBusyTime(filteredMonthlySalesData);

    const salesData = {
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
      topSellingItems: topSellingItems.map((item) => ({
        itemName: item._id,
        totalQuantity: item.totalQuantity,
      })),
      averageOrderValue,
      bestSellingCategory: bestSellingCategory.length
        ? bestSellingCategory[0]._id
        : null,
      busyTime,
      month: lastMonthStart.getMonth() + 1,
      year: lastMonthStart.getFullYear(),
    };

    await Sales.findOneAndUpdate(
      {
        month: salesData.month,
        year: salesData.year,
      },
      {
        $set: salesData,
      },
      { upsert: true }
    );

    const adjustItemRating = async () => {
      const allItems = await Item.find();

      for (const item of allItems) {
        const itemOrders = await Order.find({
          "items.name": item.itemName,
          status: "Completed",
          createdAt: {
            $gte: lastMonthStart,
            $lt: currentMonthStart,
          },
        });

        const totalQuantity = itemOrders.reduce(
          (acc, order) =>
            acc + order.items.find((i) => i.name === item.itemName).quantity,
          0
        );

        const initialRating = 1;
        const maxRating = 5;
        const scalingFactor = 0.1;

        let adjustedRating =
          initialRating +
          totalQuantity * scalingFactor * (maxRating - initialRating);

        adjustedRating = Math.max(
          initialRating,
          Math.min(maxRating, adjustedRating)
        );

        await Item.findOneAndUpdate(
          { itemName: item.itemName },
          { $set: { itemRtng: adjustedRating } }
        );
      }
    };
    await adjustItemRating();

    console.log("Monthly sales data and item ratings updated successfully.");
  } catch (error) {
    console.error("Error updating monthly sales data:", error);
  }
};

const calculateBusyTime = (orders) => {
  const orderHours = orders.map((order) =>
    new Date(order.createdAt).getHours()
  );

  const hourCounts = orderHours.reduce((acc, hour) => {
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const busiestHour = Object.keys(hourCounts).reduce((a, b) =>
    hourCounts[a] > hourCounts[b] ? a : b
  );

  return parseInt(busiestHour);
};

module.exports = { calculateSalesData };
