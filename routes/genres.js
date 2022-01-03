const express = require("express");
const Joi = require("joi");
const route = express.Router();

// Genres list
const genres = [
  {
    id: 0,
    name: "Action",
  },
  {
    id: 1,
    name: "Comedy",
  },
  {
    id: 2,
    name: "Drama",
  },
  {
    id: 3,
    name: "FanFictoin",
  },
];

const debug = require("debug")("app:genres");

route.get("/", (req, res) => {
  res.json(genres);
});

route.post("/", (req, res) => {
  const error = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres[genres.length - 1].id + 1,
    name: req.body.name,
  };
  genres.push(genre);
  return res.send(genre);
});

route.get("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === +req.params.id);

  if (!genre) return res.status(404).send("Genre not found.");

  return res.send(genre);
});

route.put("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === +req.params.id);

  if (!genre) return res.status(404).send("Genre not found.");

  const error = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  return res.send(genre);
});

route.delete("/:id", (req, res) => {
  const index = genres.findIndex((g) => g.id === +req.params.id);

  if (index === -1) return res.status(404).send("Genre not found.");

  const genre = genres.splice(index, 1);
  return res.send(genre);
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
