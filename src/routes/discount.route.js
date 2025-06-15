const express = require("express");
const {
  getDiscounts,
  postCreateDiscount,
  putUpdateDiscount,
  postApplyDiscount,
} = require("../controllers/discount.controller");
const RouterAPI = express.Router();

RouterAPI.get("/", getDiscounts);
RouterAPI.post("/", postCreateDiscount);
RouterAPI.put("/:id", putUpdateDiscount);
RouterAPI.post("/apply", postApplyDiscount);

module.exports = RouterAPI;
