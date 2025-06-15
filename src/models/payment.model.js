const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    show_time_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Showtime",
        required: true,
    },
    list_seat: {
        type: [String],
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    paid_amount: {
        type: Number,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;