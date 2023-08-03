const express = require("express");
const router = express.Router();
const validationOutput = require("../validator");
const subCategoryValidator = require("../validator/subcatrogry.validator");
const {
  getCategory,
  createCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/subcategory.controller");

// Check authentication using this middleware
const authChecker = require("../middleware/auth.checker");

// api/category
router
  .route("/")
  .get(getCategory)
  .post(subCategoryValidator, validationOutput, createCategory);

router
  .route("/:id")
  .get(getSingleCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;
