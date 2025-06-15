const {
  getUserService,
  getUserByIdService,
  updateUserService,
} = require("../services/user.service");

const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await getUserService();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserByIdService(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// các controller function khác...
const updatePassword = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ mật khẩu cũ và mới." });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Kiểm tra mật khẩu cũ có đúng không
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng." });
    }

    // Hash mật khẩu mới
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Cập nhật mật khẩu thành công." });
  } catch (error) {
    console.error("Lỗi cập nhật mật khẩu:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật mật khẩu." });
  }
};
module.exports = {
  getUsers,
  updateUser,
  getUserById,
  updatePassword
};
