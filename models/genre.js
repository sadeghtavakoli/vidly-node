const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxlength: 50 },
});

const Genre = mongoose.model("Genre", genreSchema);

// Validate genre
function validateGenre(genre) {
  const scheme = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = scheme.validate(genre);

  return error;
}
module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validate = validateGenre;
