const { check } = require("express-validator");

// Validate Order data
const orderValidator = [
  check("user_id").notEmpty().withMessage("user_id is required!"),
  // check("products").notEmpty().withMessage("products are required!"),
  // check("delivery_address")
  //   .notEmpty()
  //   .withMessage("delivery_address is required!"),
];

module.exports = orderValidator;
