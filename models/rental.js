const mongoose = require("mongoose");
const Joi = require("joi");
const rentalSchema = new mongoose.Schema({
  customer: {
    required: true,
    type: mongoose.Schema({
      name: { type: String, required: true, minLength: 5, maxLength: 50 },
      isGold: { type: Boolean, default: false },
      phone: { type: String, minLength: 5, maxLength: 50, required: true },
    }),
  },
  movie: {
    required: true,
    type: mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
  },
  dateOut: { type: Date, required: true, default: Date.now() },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validate(rental) {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
  });
  const { error } = schema.validate(rental);
  return error;
}

module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;
module.exports.validate = validate;
