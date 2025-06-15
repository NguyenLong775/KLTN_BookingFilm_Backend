const Category = require("../models/category.model");

const createCategoryService = async (category) => {
  try {
    return await Category.create(category);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCategoryService = async (id, category) => {
  try {
    return await Category.findByIdAndUpdate(id, category, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCategoriesService = async () => {
  try {
    return await Category.find();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCategoryService,
  updateCategoryService,
  getCategoriesService,
};
