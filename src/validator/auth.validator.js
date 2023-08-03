const { check } = require("express-validator");

// Validate Post Data
const authValidator = [
  check("phone").notEmpty().withMessage("phone is required!"),
  check("password").notEmpty().withMessage("password is required!"),
];

module.exports = authValidator;
