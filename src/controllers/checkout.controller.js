const createError = require("http-errors");
const checkId = require("../helpers/checkID");
const successRes = require("../helpers/success.response");
const Category = require("../models/category.model");
const Order = require("../models/order.model");

// exports.getCheckoutSession = async (req, res, next) => {
//   res.send("Get checkout route.");
// };

// Make IsPaid = ture
exports.setPaymentDone = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!checkId(id)) {
      throw createError("Check id!");
    }
    const response = await Order.findByIdAndUpdate(
      id,
      { is_paid: true },
      { new: true, select: "-profit -actual_price" }
    );
    successRes(res, 201);
  } catch (err) {
    next(err);
  }
};
