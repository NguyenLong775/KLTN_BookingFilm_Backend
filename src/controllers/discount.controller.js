const {
  createDiscountService,
  getDiscountsService,
  updateDiscountService,
  getDiscountByCodeService,
} = require("../services/discount.service");

const getDiscounts = async (req, res) => {
  try {
    const discounts = await getDiscountsService();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateDiscount = async (req, res) => {
  try {
    const newDiscount = await createDiscountService(req.body);
    res.status(201).json(newDiscount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDiscount = await updateDiscountService(id, req.body);
    res.status(200).json(updatedDiscount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postApplyDiscount = async (req, res) => {
  try {
    const { code, film_id } = req.body;

    if (!code || !film_id) {
      return res.status(400).json({ message: "Thiếu mã giảm giá hoặc ID phim" });
    }

    const discount = await getDiscountByCodeService(code, film_id);

    return res.status(200).json({
      discountId: discount._id,
      discountName: discount.discount_name,
      discountPercent: discount.percent,
      discountCode: discount.discount_code,
      message: "Mã giảm giá áp dụng thành công",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Đã xảy ra lỗi khi áp dụng mã" });
  }
};

module.exports = {
  getDiscounts,
  postCreateDiscount,
  putUpdateDiscount,
  postApplyDiscount,
};
