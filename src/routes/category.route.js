const express = require("express");
const {
  getCategories,
  postCreateCategory,
  putUpdateCategory,
} = require("../controllers/category.controller");
const RouterAPI = express.Router();

RouterAPI.get("/", getCategories);
RouterAPI.post("/", postCreateCategory);
RouterAPI.put("/:id", putUpdateCategory);

module.exports = RouterAPI;
