const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "employee", "admin"],
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
