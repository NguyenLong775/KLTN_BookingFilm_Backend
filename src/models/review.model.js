const mongoose = require('mongoose');


// Schema đánh giá
const reviewSchema = new mongoose.Schema({
    payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment", // Liên kết đến payment
        required: true,
    },
    show_time_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Showtime", // Liên kết đến showtime
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Liên kết đến user
        required: true,
    },
    film_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Film", // Liên kết đến film
        required: true,
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    comment: {
        type: String,
        default: "",
    },
    is_review: {
        type: Boolean,
        default: false, // Mặc định là chưa đánh giá
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});


// Tạo model từ schema
const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;

