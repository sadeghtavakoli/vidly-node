const express = require("express");
const connection = require("../index");
const { Customer } = require("../models/customer.js");
const { Movie } = require("../models/movie.js");
const { validate, Rental } = require("../models/rental.js");

const route = express.Router();

route.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

route.post("/", async (req, res) => {
  // validate sent movie
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //get customer base on customerId
  let customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Customer does not exist");

  //get movie base on moivieId
  let movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send(`movie does not exists`);
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  // create rental document
  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  //saving rental and updating movie's numberInStcok

  await rental.save();

  movie.numberInStock--;
  await movie.save();

  return res.send(rental);
});

module.exports = route;
