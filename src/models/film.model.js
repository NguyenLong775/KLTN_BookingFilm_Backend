const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    film_name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    release_date: {
        type: Date,
        required: true,
    },
    early_release_date: {
        type: Date,
    },
    duration: {
        type: Number,
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    director: {
        type: String,
        trim: true,
    },
    list_actor: {
        type: [String],
        default: [],
    },
    image_url: {
        type: String,
        trim: true,
    },
        trailer_url: {
        type: String,
        trim: true,
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

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;