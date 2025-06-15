const {
  signupService,
  loginService,
  sendOtpService,
  verifyOTPService,
  resetPasswordService,
  updateUserService,
} = require("../services/auth.service");
const { validationResult } = require("express-validator");

const postSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
    });
  }
  try {
    const { email, password, full_name } = req.body;
    const rs = await signupService({
      email,
      password,
      full_name,
    });
    res.status(201).json(rs);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const rs = await loginService({
      email,
      password,
    });
    res.status(200).json(rs);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const postSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await sendOtpService({
      email,
    });
    res.status(200).json({
      message: "Send OTP successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const postVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyOTPService({
      email,
      otp,
    });
    res.status(200).json({
      message: "Verify OTP successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const postResetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const rs = await resetPasswordService({
      email,
      otp,
      password,
    });
    res.status(200).json({
      message: "Reset password successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const updatedData = req.body;

  try {
    const updatedUser = await updateUserService(user_id, updatedData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser); // Trả về thông tin user sau khi cập nhật
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  postSignup,
  postLogin,
  postSendOtp,
  postVerifyOtp,
  postResetPassword,
  updateUser,
};
