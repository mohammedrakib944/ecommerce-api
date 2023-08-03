const { check } = require("express-validator");

// Validate Products data
const productValidator = [
  check("user_id").notEmpty().withMessage("user_id is required!"),
  check("product_name").notEmpty().withMessage("product_name is required!"),
  check("category").notEmpty().withMessage("category is required!"),
  check("description").notEmpty().withMessage("description is required!"),
  check("buy_price").notEmpty().withMessage("buy_price is required!"),
  check("sell_price").notEmpty().withMessage("sell_price is required!"),
  check("images").notEmpty().withMessage("images is required!"),
  check("quantity").notEmpty().withMessage("quantity is required!"),
];

module.exports = productValidator;
