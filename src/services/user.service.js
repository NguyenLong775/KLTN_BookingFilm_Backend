const User = require("../models/user.model");

const getUserService = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserByIdService = async (userId) => {
  return await User.findById(userId).lean();
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
  getUserService,
  updateUserService,
  getUserByIdService
};
