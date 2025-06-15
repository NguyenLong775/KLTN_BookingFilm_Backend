const express = require("express");
const {
  postCreateBranch,
  getBranches,
  putUpdateBranch,
} = require("../controllers/branch.controller");
const RouterAPI = express.Router();

RouterAPI.post("/", postCreateBranch);
RouterAPI.get("/", getBranches);
RouterAPI.put("/:id", putUpdateBranch);

module.exports = RouterAPI;
