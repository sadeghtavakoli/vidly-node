const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
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
});

const Movie = mongoose.model("Movie", movieSchema);

// Validate movie
function validateMovie(movie) {
  const scheme = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.string().length(24).required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
  });

  const { error } = scheme.validate(movie);
  return error;
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
module.exports.movieSchema = movieSchema;
