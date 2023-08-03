const express = require("express");
const router = express.Router();
const validationOutput = require("../validator");
const productValidator = require("../validator/product.validator");
const {
  uploadProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// Check authentication using this middleware
const authChecker = require("../middleware/auth.checker");

// /api/products/
router
  .route("/")
  .get(getProducts)
  .post(productValidator, validationOutput, uploadProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
