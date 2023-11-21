cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const orders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
      status: "Completed",
    });

    const totalSales = orders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );
    const orderCompletionTimes = orders.map((order) => order.orderCompletedAt);

    const avgOrderCompletionTime =
      calculateAvgOrderCompletionTime(orderCompletionTimes);

    await Sales.create({
      date: today,
      totalSales,
      orderCompletionTimes,
      avgOrderCompletionTime,
    });

    console.log("Daily sales report updated successfully.");
  } catch (error) {
    console.error("Error updating daily sales report:", error);
  }
});

function calculateAvgOrderCompletionTime(orderCompletionTimes) {
  if (orderCompletionTimes.length === 0) {
    return 0;
  }

  const totalCompletionTime = orderCompletionTimes.reduce(
    (total, completionTime) => total + completionTime.getTime(),
    0
  );

  return totalCompletionTime / orderCompletionTimes.length;
}
