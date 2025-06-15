const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema({
  film_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Film",
    required: true,
    trim: true,
  },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
    trim: true,
  },
  screen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch.list_screen",
    required: true,
    trim: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  vip_price: {
    type: Number,
    required: true,
  },
  normal_price: {
    type: Number,
    required: true,
  },
  booked_seats: {
    type: [String],
    default: [],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {  // Di chuyển `deletedAt` ra ngoài trường `created_at`
    type: Date, // Trường này sẽ lưu thời gian xóa
    default: null
  },
});

const Showtime = mongoose.model("Showtime", showtimeSchema);

module.exports = Showtime;
