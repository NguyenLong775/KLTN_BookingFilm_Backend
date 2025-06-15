const Film = require("../models/film.model");

const createFilmService = async (film) => {
  try {
    return await Film.create(film);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateFilmService = async (id, film) => {
  try {
    return await Film.findByIdAndUpdate(id, film, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFilmsService = async () => {
  try {
    return await Film.find().populate("category_id");
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFilmByIdService = async (id) => {
  try {
    return await Film.findById(id).populate("category_id");
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkFilmExist = async (film_id) => {
  try {
    await Film.findById(film_id);
  } catch (error) {
    throw new Error("Film not found");
  }
};

module.exports = {
  createFilmService,
  updateFilmService,
  getFilmsService,
  checkFilmExist,
  getFilmByIdService,
};
