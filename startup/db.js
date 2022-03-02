const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/vidly-node", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("connected to vidly-node db..."));
};
