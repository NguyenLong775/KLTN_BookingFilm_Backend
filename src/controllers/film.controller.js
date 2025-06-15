const {
  createFilmService,
  getFilmsService,
  updateFilmService,
  getFilmByIdService,
} = require("../services/film.service");
const { uploadToFirebase } = require("../services/firebase.service");

const getFilms = async (req, res) => {
  try {
    const films = await getFilmsService();
    res.status(200).json(films);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateFilm = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const fileBuffer = req.file.buffer;
    const fileName = Date.now();
    const mimeType = req.file.mimetype;

    const publicUrl = await uploadToFirebase(
      fileBuffer,
      fileName,
      mimeType,
      "imgFilm"
    );
    req.body.image_url = publicUrl;
    const newFilm = await createFilmService(req.body);
    res.status(201).json(newFilm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateFilm = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const fileName = Date.now();
      const mimeType = req.file.mimetype;

      const publicUrl = await uploadToFirebase(
        fileBuffer,
        fileName,
        mimeType,
        "imgFilm"
      );
      req.body.image_url = publicUrl;
    }
    const updatedFilm = await updateFilmService(id, req.body);
    res.status(200).json(updatedFilm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFilmById = async (req, res) => {
  try {
    const { id } = req.params;
    const film = await getFilmByIdService(id);
    res.status(200).json(film);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getFilms, postCreateFilm, putUpdateFilm, getFilmById };
