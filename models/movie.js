const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxlength: 255,
    },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, required: true, min: 0, max: 255 },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

// Validate movie
function validateMovie(movie) {
  const scheme = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    genreId: Joi.string().length(24).required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
  });

  const { error } = scheme.validate(movie);
  return error;
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
