const createError = require("http-errors");
const checkId = require("../helpers/checkID");
const successRes = require("../helpers/success.response");
const Coupon = require("../models/coupon.model");

// CREATE COUPON
exports.createCoupon = async (req, res, next) => {
  try {
    const { discount } = req.body;
    if (!checkId(req.body.user_id)) {
      throw createError("user_id is not valid!");
    }
    if (discount < 5 || discount > 75) {
      throw createError("Discount Range 5-75 %");
    }
    const response = await Coupon.create(req.body);
    successRes(res, 200, response);
  } catch (err) {
    next(err);
  }
};

// GET COUPONs
exports.getCoupons = async (req, res, next) => {
  try {
    const response = await Coupon.find();
    successRes(res, 200, response);
  } catch (err) {
    next(err);
  }
};

// Update COUPON
exports.updateCoupon = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!checkId(id)) {
      throw createError("coupon_id is not valid!");
    }
    const response = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    successRes(res, 200, response);
  } catch (err) {
    next(err);
  }
};

// Delete COUPON
exports.deleteCoupon = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!checkId(id)) {
      throw createError("coupon_id is not valid!");
    }
    await Coupon.findByIdAndDelete(id);
    successRes(res, 200);
  } catch (err) {
    next(err);
  }
};
