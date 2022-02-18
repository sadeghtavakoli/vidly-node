const winston = require("winston");

module.exports = async function (err, req, res, next) {
  winston.error(err.message, err);
  res.status(500).send("something messed up");
};
