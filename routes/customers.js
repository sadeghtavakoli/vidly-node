const express = require("express");
const { Customer, validate } = require("../models/customer");
const mongoose = require("mongoose");

const route = express.Router();

route.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

route.post("/", async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  const savedCustomer = await customer.save();
  return res.send(savedCustomer);
});

route.get("/:id", async (req, res) => {
  // Check if id is valid ObjectId
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isIdValid) return res.status(400).send("Invalid Id");

  // check if customer exists
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given Id not found");

  return res.send(customer);
});

route.put("/:id", async (req, res) => {
  //Check if sent customer is valid
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if id is valid ObjectId
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isIdValid) return res.status(400).send("Invalid Id");

  // check if customer exists
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );

  if (!customer)
    return res.status(404).send("Customer with given Id not found");

  return res.send(customer);
});

route.delete("/:id", async (req, res) => {
  // Check if id is valid ObjectId
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isIdValid) return res.status(400).send("Invalid Id");

  // check if customer exists
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res.status(404).send("Customer with given Id not found");

  return res.send(customer);
});

module.exports = route;
