const mongoose = require("mongoose");
const { calculateSalesData } = require("../utils/sales-utils");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

calculateSalesData()
  .then(() => {
    console.log("Test completed successfully.");
  })
  .catch((error) => {
    console.error("Test failed:", error);
  })
  .finally(() => {
    mongoose.disconnect();
  });
