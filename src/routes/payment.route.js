const express = require("express");
const {
  getPayments,
  postCreatePayment,
  putUpdatePayment,
  getPaymentByShowTimeId,
  paymentWithMomo,
  callBackMoMo,
} = require("../controllers/payment.controller");
const { auth } = require("../middlewares/auth.middleware");
const RouterAPI = express.Router();

RouterAPI.get("/", getPayments);
RouterAPI.get("/:show_time_id/showtime", getPaymentByShowTimeId);
RouterAPI.post("/momopay", auth, paymentWithMomo);
RouterAPI.post("/", auth, postCreatePayment);
RouterAPI.post("/callback", callBackMoMo);
RouterAPI.put("/:id", putUpdatePayment);

module.exports = RouterAPI;
