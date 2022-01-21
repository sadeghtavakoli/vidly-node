const express = require("express");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const route = express();

route.post("/", async (req, res) => {
  // validating user format
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate email
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // validate password
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordValid)
    return res.status(400).send("Invalid email or password.");

  // generating json web token
  const token = user.generateAuthToken();

  //sending only desired properties
  return res.send(token);
});

function validate(request) {
  const scheme = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  const { error } = scheme.validate(request);

  return error;
}

module.exports = route;
