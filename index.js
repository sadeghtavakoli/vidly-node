const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const app = express();
mongoose
  .connect("mongodb://localhost/vidly-node")
  .then(() => console.log("connected to vidly-node db..."))
  .catch(() => console.log("could not connect to vidly-node db..."));

const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.listen(port, () => console.log("Vidly is istening on port " + port));
