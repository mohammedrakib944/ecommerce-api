const { check } = require("express-validator");

// Validate Category data
const couponValidator = [
  check("user_id").notEmpty().withMessage("user_id is required!"),
  check("code").notEmpty().withMessage("code is required!"),
  check("discount").notEmpty().withMessage("discount is required!"),
  check("exp_date").notEmpty().withMessage("exp_date is required!"),
];

module.exports = couponValidator;
