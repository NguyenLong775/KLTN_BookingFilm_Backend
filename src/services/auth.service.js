const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../util/email.transporter");

const signupService = async (data) => {
  try {
    const { email, password, full_name } = data;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Email đã tồn tài");
    }
    if (password.length < 6) {
      throw new Error("Mật khẩu ít nhất 6 ký tự");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let rs = await User.create({
      email,
      password: hashedPassword,
      full_name,
    });
    return rs;
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginService = async (data) => {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email chưa đăng ký");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu không đúng");
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    return { user, token };
  } catch (err) {
    throw new Error(err.message);
  }
};

const sendOtpService = async (data) => {
  try {
    const { email } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email chưa đăng ký");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();
    await sendMail(email, "confirm your OTP", `OTP: ${otp}`);
  } catch (err) {
    throw new Error(err.message);
  }
};

const verifyOTPService = async (data) => {
  try {
    const { email, otp } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    if (user.otp !== otp) {
      throw new Error("OTP không đúng");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const resetPasswordService = async (data) => {
  try {
    const { email, otp, password } = data;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email chưa đăng ký");
    }
    if (user.otp !== otp) {
      throw new Error("OTP không đúng");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    user.otp = null;
    await user.save();
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateUserService = async (userId, updatedData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  signupService,
  loginService,
  updateUserService,
  sendOtpService,
  verifyOTPService,
  resetPasswordService,
};
