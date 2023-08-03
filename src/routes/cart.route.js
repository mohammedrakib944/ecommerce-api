const express = require("express");
const router = express.Router();
const validationOutput = require("../validator");
const cartValidator = require("../validator/cart.validator");
const {
  createCart,
  getAllCarts,
  incrementItem,
  decrementItem,
  deleteCart,
} = require("../controllers/cart.controller");

// Check authentication using this middleware
const authChecker = require("../middleware/auth.checker");

// api/category
router.post("/", cartValidator, validationOutput, createCart);
router.patch("/increment", incrementItem);
router.patch("/decrement", decrementItem);
router.get("/:user_id", getAllCarts);
router.delete("/:cart_id", deleteCart);

module.exports = router;
