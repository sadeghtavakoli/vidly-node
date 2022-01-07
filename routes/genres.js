const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const debug = require("debug")("app:genres");

const route = express.Router();

// Genres list
// Create Genre schema and model
const Genre = mongoose.model(
  "Genre",
  mongoose.Schema({
    name: { type: String, required: true, minLength: 3, maxlength: 50 },
  })
);

loadGenreIndex();
async function loadGenreIndex() {
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
}

route.get("/", async (req, res) => {
  const genres = await Genre.find().select("name");
  res.send(genres);
});

route.post("/", async (req, res) => {
  const error = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  const savedGenre = await genre.save();

  return res.send(savedGenre);
});

route.get("/:id", async (req, res) => {
  const id = req.params.id;
  // Check if  given id is a valid ObjectId
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) return res.status(400).send("Invalid Id");

  // Check if genre with given id exists
  const isGenreExist = await Genre.exists({ _id: req.params.id });
  if (!isGenreExist) return res.status(404).send("Genre not found.");

  // return genre
  const genre = await Genre.findById(req.params.id);
  return res.send(genre);
});

route.put("/:id", async (req, res) => {
  // Check if given genre is in right format
  const error = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;
  // Check if  given id is a valid ObjectId
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) return res.status(400).send("Invalid Id");

  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send("Genre not found.");

  return res.send(genre);
});

route.delete("/:id", async (req, res) => {
  const id = req.params.id;
  // Check if  given id is a valid ObjectId
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) return res.status(400).send("Invalid Id");

  const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
  if (!deletedGenre) return res.status(404).send("Genre not found.");

  return res.send(deletedGenre);
});

// Validate genre
function validateGenre(genre) {
  const scheme = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = scheme.validate(genre);

  return error;
}

module.exports = route;
