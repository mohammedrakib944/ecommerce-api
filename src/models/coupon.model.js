const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  user_id: {
    type: String, // mongoose.Schema.Types.ObjectId,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  exp_date: {
    type: Date,
    required: true,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
