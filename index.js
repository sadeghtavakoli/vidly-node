const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const app = express();
mongoose
  .connect("mongodb://localhost/vidly-node", {
    retryWrites: false,
  })
  .then(() => console.log("connected to vidly-node db..."))
  .catch((err) => console.log("could not connect to vidly-node db..." + err));

const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.listen(port, () => console.log("Vidly is istening on port " + port));

module.exports = mongoose.connection;
