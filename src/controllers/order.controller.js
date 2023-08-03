const Order = require("../models/order.model");
const Cart = require("../models/cart.modal");
const Coupon = require("../models/coupon.model");
const User = require("../models/user.model");
const createError = require("http-errors");
const checkId = require("../helpers/checkID");
const successRes = require("../helpers/success.response");

// Shipping Charge
const { shippingCharge } = require("../secret");

// Create order
exports.createOrder = async (req, res, next) => {
  const { user_id } = req.body;

  try {
    // check user id
    const user = await User.findById(user_id);

    if (!user) {
      throw createError("No user found!");
    }

    // Get cart items
    const CartItems = await Cart.find({ user_id }).populate("product");
    let total_price = 0;
    let actual_price = 0;
    let products_id = [];

    if (CartItems.length > 0) {
      // Calculate total price
      await Promise.all(
        CartItems.map(async (item) => {
          total_price += item.quantity * item.product.sell_price;
          actual_price += item.quantity * item.product.buy_price;
          products_id.push(item.product._id);
        })
      );

      const order_response = await Order.create({
        user_id,
        products: products_id,
        total_price: Number(total_price) + Number(shippingCharge),
        actual_price,
      });

      // if create order is successfull -> delete cart
      if (order_response) {
        const deleteResponse = await Cart.deleteMany({ user_id });
        if (!deleteResponse) {
          throw createError("Could not delete cart items.");
        }
      }

      const { actual_price: buyPrice, ...rest } = order_response.toObject();
      successRes(res, 201, { ...rest, shipping_cost: shippingCharge });
    } else {
      throw createError("No cart item found!");
    }
  } catch (error) {
    next(error);
  }
};

// Handle coupon code
exports.discountPrice = async (req, res, next) => {
  const { coupon, order_id } = req.body;

  try {
    if (!coupon) {
      throw createError("No coupon found!");
    }

    if (!order_id || !checkId(order_id)) {
      throw createError("Check order_id!");
    }

    // Find coupon
    const DBcoupon = await Coupon.findOne({ code: coupon });

    if (!DBcoupon) {
      throw createError(`${coupon} - this coupon is not avaiable!`);
    }

    // Find order
    const order = await Order.findById(order_id);

    if (!order) {
      throw createError(`No order found with ${order_id} this id`);
    }
    // Dsicount
    const discount = Math.round(
      (DBcoupon.discount / 100) * order.total_order_price
    );
    // New price
    const total_order_price = order.total_order_price - discount;
    // Update order price
    const updateOrder = await Order.findByIdAndUpdate(
      order_id,
      { total_order_price, discount },
      { new: true, select: "-profit -actual_price" }
    );

    successRes(res, 201, updateOrder);
  } catch (err) {
    next(err);
  }
};

// GET All Orders
exports.getAllOrder = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [{ user_id: { $regex: searchRegExp } }],
    };

    // Don't send profit and actual_price
    const options = { profit: 0, actual_price: 0 };

    // Searching
    const response = await Order.find(filter, options)
      .populate("products")
      .limit(limit)
      .skip((page - 1) * limit);

    res.json(response);

    // const totalOrders = await Order.find(filter).countDocuments();

    // if (!response || response.length < 1) {
    //   throw createError(404, "No order found!");
    // }
    // successRes(res, 200, {
    //   pagination: {
    //     totalPages: Math.ceil(totalOrders / limit),
    //     currentPage: page,
    //     previousPage: page - 1 > 0 ? page - 1 : null,
    //     nextPage: page + 1 <= Math.ceil(totalOrders / limit) ? page + 1 : null,
    //   },
    //   orders: response,
    // });
  } catch (err) {
    next(err);
  }
};

// GET User Orders
exports.getSingleOrder = async (req, res, next) => {
  const user_id = req.params.user_id;
  try {
    if (!checkId(user_id)) {
      throw createError("user_id is not valid!");
    }
    // Don't send password
    const options = { profit: 0, actual_price: 0 };
    const response = await Order.find({ user_id }, options)
      .sort({ is_paid: 1, created_at: -1 })
      .populate("products");

    // If no order found
    if (!response || response.length < 1) {
      throw createError("No order found!");
    }
    // send response
    successRes(res, 200, { order: response });
  } catch (err) {
    next(err);
  }
};

// Delete order
exports.deleteOrder = async (req, res, next) => {
  const order_id = req.params.order_id;
  try {
    if (!checkId(order_id)) {
      throw createError("order_id is not valid!");
    }
    await Order.findByIdAndDelete(order_id);
    successRes(res, 200);
  } catch (err) {
    next(err);
  }
};

// Update Status
exports.changeStatus = async (req, res, next) => {
  const { status, order_id } = req.body;
  try {
    if (
      !status ||
      !["pending", "processing", "shipped", "delivered"].includes(status)
    ) {
      throw createError(
        "Status should in [pending,processing,shipped,delivered]!"
      );
    }

    if (!order_id || !checkId(order_id)) {
      throw createError("Check order_id!");
    }

    const response = await Order.findByIdAndUpdate(
      order_id,
      { status },
      { new: true, select: "-profit -actual_price" }
    );
    successRes(res, 201, response);
  } catch (err) {
    next(err);
  }
};

// Get single order
exports.getSingleOrderByOrderID = async (req, res, next) => {
  const order_id = req.params.order_id;
  try {
    if (!checkId(order_id)) {
      throw createError("order_id is not valid!");
    }
    const order_res = await Order.findById(order_id);
    successRes(res, 200, order_res);
  } catch (err) {
    next(err);
  }
};
// Payment success
exports.paymentSuccess = async (req, res, next) => {
  const order_id = req.params.order_id;
  try {
    if (!checkId(order_id)) {
      throw createError("order_id is not valid!");
    }
    await Order.findByIdAndUpdate(order_id, { is_paid: true });
    successRes(res, 200);
  } catch (err) {
    next(err);
  }
};
