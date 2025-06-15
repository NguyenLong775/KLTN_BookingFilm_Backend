const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  screen_name: {
    type: String,
    required: true,
    trim: true,
  },
  total_seat: {
    type: Number,
    required: true,
    min: 0,
  },
});

const branchSchema = new mongoose.Schema({
  branch_name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  list_screen: {
    type: [screenSchema],
    default: [],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
