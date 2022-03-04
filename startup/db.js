const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  const connectionString = config.get("db");
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info(`connected to ${connectionString} ...`));
};
