const { check } = require("express-validator");

// Validate Post Data
const userValidator = [
  check("name").notEmpty().withMessage("name is required!"),
  check("email")
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("Please Enter a vlid email!"),
  check("phone")
    .notEmpty()
    .withMessage("phone is required!")
    .isLength({ min: 11, max: 11 })
    .withMessage("Enter a valid mobile number!"),
  check("address").notEmpty().withMessage("address is required!"),
  check("password").notEmpty().withMessage("password is required!"),
];

module.exports = userValidator;
