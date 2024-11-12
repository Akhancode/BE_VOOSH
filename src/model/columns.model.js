const mongoose = require("mongoose");

const ColumnSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  col_todo: {
    type: [String],
    required: true,
    default: [],
  },
  col_inProgress: {
    type: [String],
    required: true,
    default: [],
  },
  col_Done: {
    type: [String],
    required: true,
    default: [],
  },
});

const Column = mongoose.model("Column", ColumnSchema);

module.exports = Column;
