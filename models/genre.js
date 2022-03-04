const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 5, maxlength: 50 },
});

const Genre = mongoose.model("Genre", genreSchema);

// Validate genre
function validateGenre(genre) {
  const scheme = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  const { error } = scheme.validate(genre);

  return error;
}
module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validate = validateGenre;
