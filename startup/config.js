const config = require("config");

module.exports = function () {
  //Check for jwt private key
  if (!config.get("jwtPrivateKey"))
    throw new Error("FATAL ERROR : jwtPrivateKey is not defined");
};
