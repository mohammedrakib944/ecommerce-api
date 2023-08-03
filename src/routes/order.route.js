const express = require("express");
const router = express.Router();
const orderValidator = require("../validator/order.validator");
const validationOutput = require("../validator");
const {
  createOrder,
  getAllOrder,
  discountPrice,
  getSingleOrder,
  changeStatus,
  deleteOrder,
  getSingleOrderByOrderID,
  paymentSuccess,
} = require("../controllers/order.controller");
const checkAuth = require("../middleware/auth.checker");

router.patch("/coupon", discountPrice);
router.patch("/status", changeStatus);

// Place order

// /api/order
router
  .route("/")
  .get(getAllOrder)
  .post(orderValidator, validationOutput, createOrder);

router.route("/:user_id").get(getSingleOrder);
router.route("/singe/:order_id").get(getSingleOrderByOrderID);
router.route("/remove/:order_id").delete(deleteOrder);
router.route("/payment/:order_id").patch(paymentSuccess);

module.exports = router;
