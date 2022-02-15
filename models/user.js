const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 5, maxlength: 50 },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxlength: 255,
    unique: true,
  },
  password: { type: String, required: true, minLength: 5, maxlength: 1024 },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    _.pick(this, ["_id", "isAdmin"]),
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

// Validate genre
function validateUser(user) {
  const scheme = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.boolean(),
  });

  const { error } = scheme.validate(user);

  return error;
}
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validate = validateUser;
