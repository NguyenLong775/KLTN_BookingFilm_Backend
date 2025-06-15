const Review = require('../models/review.model'); // Import Review Model


// Tạo một review mới
const createReview = async (req, res) => {
  try {
    const { payment_id, show_time_id, user_id, film_id, rate, comment } = req.body;


    // Kiểm tra xem đã có đánh giá cho payment_id này chưa
    const existingReview = await Review.findOne({ payment_id });
    if (existingReview) {
      return res.status(400).json({ message: "Đánh giá đã tồn tại cho vé này." });
    }


    // Tạo review mới
    const newReview = new Review({
      payment_id,
      show_time_id,
      user_id,
      film_id,
      rate,
      comment,
      is_review: true, // Đánh dấu là đã review
    });


    // Lưu review vào DB
    await newReview.save();


    res.status(201).json({ message: "Đánh giá thành công!", review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi tạo đánh giá." });
  }
};


// Cập nhật review (nếu cần)
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rate, comment } = req.body;


    // Tìm review theo ID
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá." });
    }


    // Cập nhật đánh giá
    review.rate = rate;
    review.comment = comment;
    review.is_review = true; // Đảm bảo đánh giá đã được hoàn thành
    review.updated_at = Date.now();


    await review.save();


    res.status(200).json({ message: "Cập nhật đánh giá thành công!", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật đánh giá." });
  }
};


// Lấy tất cả đánh giá của một vé
const getReviewsByPayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const reviews = await Review.find({ payment_id }).populate('user_id', 'name email').populate('film_id', 'name');


    if (!reviews) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá cho vé này." });
    }


    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy đánh giá." });
  }
};


// Lấy tất cả review theo film_id
const getReviewsByFilm = async (req, res) => {
  try {
    const { film_id } = req.params;
    const reviews = await Review.find({ film_id })
      .populate("user_id", "name email")
      .sort({ created_at: -1 });


    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error getting reviews by film:", error);
    res.status(500).json({ message: "Có lỗi khi lấy đánh giá theo phim." });
  }
};


// Lấy tất cả review theo user_id
const getReviewsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const reviews = await Review.find({ user_id })
      .populate("film_id", "film_name")
      .sort({ created_at: -1 });


    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error getting reviews by user:", error);
    res.status(500).json({ message: "Có lỗi khi lấy đánh giá theo người dùng." });
  }
};


const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('user_id', 'name email') // Lấy tên & email người dùng
      .populate('film_id', 'film_name')  // Lấy tên phim
      .sort({ created_at: -1 }); // Sắp xếp mới nhất trước


    res.status(200).json({ reviews });
  } catch (error) {
    console.error("❌ Error fetching all reviews:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy danh sách đánh giá." });
  }
};


module.exports = { createReview, updateReview, getReviewsByPayment, getReviewsByFilm, getReviewsByUser, getAllReviews };



