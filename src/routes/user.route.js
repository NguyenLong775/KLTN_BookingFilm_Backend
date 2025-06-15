const express = require("express");
const { getUsers,getUserById, updateUser ,updatePassword } = require("../controllers/user.controller");
const RouterAPI = express.Router();

RouterAPI.get("/", getUsers);
RouterAPI.get("/:id", getUserById);
RouterAPI.put("/:user_id", updateUser);
RouterAPI.put("/:user_id/password", updatePassword);

module.exports = RouterAPI;
