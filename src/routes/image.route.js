const express = require("express");
const router = express.Router();

const {
  uploadImages,
  getProductImages,
  deleteProductImage,
} = require("../controllers/image.controller");

// Check authentication using this middleware
const authChecker = require("../middleware/auth.checker");

const imageUplaod = require("../middleware/imageUpload");
const resizeImage = require("../middleware/resizeImage");

// api/products-image
router
  .route("/:user_id") // id is user_id
  .get(getProductImages)
  .post(imageUplaod, resizeImage, uploadImages)
  .delete(deleteProductImage);

module.exports = router;
