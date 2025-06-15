const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    discount_name: {
        type: String,
        trim: true,
    },
    discount_code: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    percent: {
        type: Number,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    film_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film',
        required: false,  
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

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;