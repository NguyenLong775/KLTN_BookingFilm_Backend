const { checkFilmExist } = require("../services/film.service");
const {
  createShowtimeService,
  getShowtimesService,
  updateShowtimeService,
  getShowTimeByFilmIdService,
  deleteShowtimeService,
  getShowtimesByIdService
} = require("../services/showtime.service");

const getShowtimes = async (req, res) => {
  try {
    const showtimes = await getShowtimesService();
    res.status(200).json(showtimes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getShowtimesByFilmId = async (req, res) => {
  try {
    const { film_id } = req.params;
    await checkFilmExist(film_id);
    const showtimes = await getShowTimeByFilmIdService(film_id);
    res.status(200).json(showtimes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateShowtime = async (req, res) => {
  try {
    const {
      film_id,
      branch_id,
      screen_id,
      start_time,
      duration,
      vip_price,
      normal_price,
    } = req.body;
    const newShowtime = await createShowtimeService({
      film_id,
      branch_id,
      screen_id,
      start_time,
      duration,
      vip_price,
      normal_price,
    });
    res.status(201).json(newShowtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const { film_id, branch_id, screen_id, start_time, duration, is_active } =
      req.body;
    const updatedShowtime = await updateShowtimeService(id, {
      film_id,
      branch_id,
      screen_id,
      start_time,
      duration,
      is_active,
    });
    res.status(200).json(updatedShowtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteShowtime = async (req, res) => {
  try {
    const id = req.params.id; 
    console.log("In ra id lay duoc",id)
    const deleteshowtime = await deleteShowtimeService(id)
    res.status(200).json(deleteshowtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getShowtimesById = async (req, res) => {
  try {
    const id = req.params.id; 
    console.log("In ra id lay duoc",id)
    const showtimebyid = await getShowtimesByIdService(id)
    res.status(200).json(showtimebyid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getShowtimes,
  postCreateShowtime,
  putUpdateShowtime,
  getShowtimesByFilmId,
  deleteShowtime,
  getShowtimesById
};
