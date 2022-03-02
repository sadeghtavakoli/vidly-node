require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  // process.on("uncaughtException", (ex) => {
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  // process.on("unhandledRejection", (ex) => {
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  // winston.exitOnError = false;

  winston.add(
    new winston.transports.File({
      filename: "logs.log",
      handleExceptions: true,
      handleRejections: true,
    })
  );
  winston.add(new winston.transports.Console());
  winston.ExceptionHandler;
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly-node",
      level: "info",
      options: { useUnifiedTopology: true },
    })
  );
};
