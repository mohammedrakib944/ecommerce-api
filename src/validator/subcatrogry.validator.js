const { check } = require("express-validator");

// Validate Sub Category data
const subCategoryValidator = [
  check("category_id").notEmpty().withMessage("category_id is required!"),
  check("category_name").notEmpty().withMessage("category_name is required!"),
];

module.exports = subCategoryValidator;
