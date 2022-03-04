const express = require("express");
const winston = require("winston");

const app = express();

require("./startup/db")();
require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info("Vidly is istening on port " + port)
);
module.exports = server;
