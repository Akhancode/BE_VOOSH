const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reminder: { type: String }, // Store as HH:mm format (e.g., "09:30")
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
