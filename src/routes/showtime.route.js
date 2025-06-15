const express = require("express");
const {
  getShowtimes,
  postCreateShowtime,
  putUpdateShowtime,
  getShowtimesByFilmId,
  deleteShowtime,
  getShowtimesById
} = require("../controllers/showtime.controller");
const RouterAPI = express.Router();

RouterAPI.get("/", getShowtimes);
RouterAPI.get("/:id", getShowtimesById);
RouterAPI.get("/:film_id/film", getShowtimesByFilmId);
RouterAPI.post("/", postCreateShowtime);
RouterAPI.put("/:id", putUpdateShowtime);
RouterAPI.delete("/:id", deleteShowtime);

module.exports = RouterAPI;
