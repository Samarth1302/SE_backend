const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
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
