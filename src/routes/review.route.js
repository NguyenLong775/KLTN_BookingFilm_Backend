const express = require("express");
const { createReview, updateReview, getReviewsByPayment, getReviewsByFilm,
    getReviewsByUser, getAllReviews } = require("../controllers/review.controller");
const RouterAPI = express.Router();

RouterAPI.post("/", createReview);
RouterAPI.get("/getAll", getAllReviews);
RouterAPI.get("/payment/:payment_id", getReviewsByPayment);
RouterAPI.get("/film/:film_id", getReviewsByFilm);
RouterAPI.get("/user/:user_id", getReviewsByUser);

module.exports = RouterAPI;





