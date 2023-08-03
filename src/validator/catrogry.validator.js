const { check } = require("express-validator");

// Validate Category data
const categoryValidator = [
  check("user_id").notEmpty().withMessage("user_id is required!"),
  check("category_name").notEmpty().withMessage("category_name is required!"),
];

module.exports = categoryValidator;
