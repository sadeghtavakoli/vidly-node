const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");

const route = express.Router();

route.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

route.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) return res.status(400).send("User not found!");

  res.send(user);
});

route.post("/", async (req, res) => {
  // validating user format
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check to see if user alreay exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user alreay registerd");

  //creating user and saving it to database
  user = new User(_.pick(req.body, ["name", "password", "email"]));

  // hash password
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
