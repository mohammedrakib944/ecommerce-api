const express = require("express");
const router = express.Router();
const validationOutput = require("../validator");
const couponValidation = require("../validator/coupon.validator");
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controller.js");

// /api/coupon
router
  .route("/")
  .get(getCoupons)
  .post(couponValidation, validationOutput, createCoupon);

router.route("/:id").patch(updateCoupon).delete(deleteCoupon);

module.exports = router;
