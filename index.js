const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const config = require("config");

const app = express();

//Check for jwt private key
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR : jwtPrivateKey is not defined");
  process.exit(1);
}
//
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
app.use("/api/users", users);
app.use("/api/auth", auth);

app.listen(port, () => console.log("Vidly is istening on port " + port));

module.exports = mongoose.connection;
