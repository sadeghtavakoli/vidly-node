const mongoose = require("mongoose");
module.exports = function (req, res, next) {
  const id = req.params.id;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);

  if (!isIdValid) return res.status(404).send("Invalid Id.");

  next();
};
