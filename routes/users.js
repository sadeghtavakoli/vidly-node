const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");

const route = express();

route.post("/", async (req, res) => {
  // validating user format
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check to see if user alreay exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user alreay registerd");

  //creating user and saving it to database
  user = new User(_.pick(req.body, ["name", "password", "email"]));

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);
  user.password = hash;
  await user.save();

  //sending only desired properties and jwt
  const token = user.generateAuthToken();
  return res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = route;
