const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  full_name: {
    type: String,
    // required: [true, "Please provide a name"],
  },
  gender: {
    type: Boolean,
  },
  phone: {
    type: String,
  },
  otp: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  role_id: {
    type: Number,
    default: 2,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
