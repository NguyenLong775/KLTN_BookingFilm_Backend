const {
  getCategoriesService,
  createCategoryService,
  updateCategoryService,
} = require("../services/category.service");

const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesService();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const newCategory = await createCategoryService({
      category_name,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, is_active } = req.body;
    const updatedCategory = await updateCategoryService(id, {
      category_name,
      is_active,
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  postCreateCategory,
  putUpdateCategory,
};
