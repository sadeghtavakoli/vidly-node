const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");
const debug = require("debug")("app:genres");
const route = express.Router();

route.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

route.post("/", auth, async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: { _id: genre._id, name: genre.name },
  });
  const result = await movie.save();

  return res.send(result);
});

route.get("/:id", async (req, res) => {
  const id = req.params.id;
  // Check if  given id is a valid ObjectId
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) return res.status(400).send("Invalid Id");

  // Check if movie with given id exists
  const isMovieExist = await Movie.exists({ _id: req.params.id });
  if (!isMovieExist) return res.status(404).send("Movie not found.");

  // return movie
  const movie = await Movie.findById(req.params.id);
  return res.send(movie);
});

route.put("/:id", auth, async (req, res) => {
  // Check if given movie is in right format
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;
  // Check if  given id is a valid ObjectId
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) return res.status(400).send("Invalid Id");

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const movie = await Movie.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: { _id: genre._id, name: genre.name },
    },
    { new: true }
  );
  if (!movie) return res.status(404).send("Movie not found.");

  return res.send(movie);
});

route.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  // Check if  given id is a valid ObjectId
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) return res.status(400).send("Invalid Id");

  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
  if (!deletedMovie) return res.status(404).send("Movie not found.");

  return res.send(deletedMovie);
});

module.exports = route;
