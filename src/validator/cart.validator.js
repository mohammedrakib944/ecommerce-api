const { check } = require("express-validator");

// Validate Category data
const cartValidator = [
  check("user_id").notEmpty().withMessage("user_id is required!"),
  check("product").notEmpty().withMessage("product is required!"),
  check("quantity").notEmpty().withMessage("Quantity should not empty!"),
];

module.exports = cartValidator;
