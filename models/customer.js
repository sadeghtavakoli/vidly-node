const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: { type: String, required: true, minLength: 5, maxLength: 50 },
    isGold: { type: Boolean, default: false },
    phone: { type: String, minLength: 5, required: true },
  })
);

// Validation logic
const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(10).required(),
  });
  const { error } = schema.validate(customer);
  return error;
};
module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
