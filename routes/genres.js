const express = require("express");
const mongoose = require("mongoose");
const { Genre, validate } = require("../models/genre");
const debug = require("debug")("app:genres");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

const route = express.Router();

// populate index with default genres if its empty
(async () => {
  try {
    // populate db with inital Data
    const currentGenres = await Genre.find();
    if (currentGenres.length !== 0) return;

    const initialGenres = [
      {
        name: "Action",
      },
      {
        name: "Comedy",
      },
      {
        name: "Drama",
      },
      {
        id: 3,
        name: "FanFictoin",
      },
    ];
    for (let g of initialGenres) {
      const genre = new Genre({ ...g });
      await genre.save();
    }
  } catch (err) {
    debug("error in connectiong to db: ", err);
  }
})();

route.get("/", async (req, res) => {
  const genres = await Genre.find().select("name");
  res.send(genres);
});

route.post("/", auth, async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  const savedGenre = await genre.save();

  return res.send(savedGenre);
});

route.get("/:id", validateObjectId, async (req, res) => {
  // Check if genre with given id exists
  const isGenreExist = await Genre.exists({ _id: req.params.id });
  if (!isGenreExist) return res.status(404).send("Genre not found.");

  // return genre
  const genre = await Genre.findById(req.params.id);
  return res.send(genre);
});

route.put("/:id", [validateObjectId, auth], async (req, res) => {
  // Check if given genre is in right format
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send("Genre not found.");

  return res.send(genre);
});

route.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
  if (!deletedGenre) return res.status(404).send("Genre not found.");

  return res.send(deletedGenre);
});

module.exports = route;
