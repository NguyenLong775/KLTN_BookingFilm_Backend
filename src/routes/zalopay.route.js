const express = require("express");
const router = express.Router();
const {
  createOrderZaloPay,
  handleCallback,
  verifyPaymentZaloPay,
} = require("../controllers/zalopay.controller");
const { auth } = require("../middlewares/auth.middleware");

router.post("/create-order", auth, createOrderZaloPay);
router.post("/callback", handleCallback);
router.get("/verify-payment", verifyPaymentZaloPay);

module.exports = router;
