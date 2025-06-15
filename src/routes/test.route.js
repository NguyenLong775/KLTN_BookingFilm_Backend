const express = require("express");

const RouterAPI = express.Router();

RouterAPI.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

module.exports = RouterAPI;
