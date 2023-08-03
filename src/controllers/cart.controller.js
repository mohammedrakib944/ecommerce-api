const createError = require("http-errors");
const checkId = require("../helpers/checkID");
const successRes = require("../helpers/success.response");
const Cart = require("../models/cart.modal");
const Product = require("../models/product.model");

// create cart
exports.createCart = async (req, res, next) => {
  const { user_id, product, quantity } = req.body;
  try {
    if (quantity < 1) {
      throw createError("Quantity could't be less then 1");
    }

    if (!checkId(user_id)) {
      throw createError("user_id is not valid");
    }

    if (!checkId(product)) {
      throw createError("product is not valid!");
    }
    // find product
    const DBproduct = await Product.findById(product);

    if (quantity > DBproduct.quantity) {
      throw createError("Stock limited!");
    }

    // Check if the cart item already exists for the given user and product
    let cartItem = await Cart.findOne({ user_id, product });

    if (cartItem) {
      // If the cart item already exists, update the quantity
      const updatedQuantity = (cartItem.quantity += quantity);
      if (updatedQuantity > DBproduct.quantity) {
        throw createError("Stock limited!");
      } else {
        await cartItem.save();
      }
    } else {
      // If the cart item doesn't exist, create a new entry
      cartItem = new Cart({ user_id, product, quantity });
      await cartItem.save();
    }
    successRes(res, 201, { message: "Cart item added successfully" });
  } catch (error) {
    next(error);
  }
};

// incrementing the quantity of a product in the cart
exports.incrementItem = async (req, res, next) => {
  const { cart_id } = req.body;
  try {
    if (!checkId(cart_id)) {
      throw createError("cart_id is not valid");
    }

    const cartItem = await Cart.findById(cart_id);

    if (cartItem) {
      // find product
      const DBproduct = await Product.findById(cartItem.product_id.toString());
      const updatedQuantity = (cartItem.quantity += 1);
      if (updatedQuantity > DBproduct.quantity) {
        next("Stock limited!");
      } else {
        await cartItem.save();
        successRes(res, 201, { message: "1 more item added successfully" });
      }
    } else {
      throw createError("Cart item not found!");
    }
  } catch (error) {
    next(error);
  }
};

// Decrement One item
exports.decrementItem = async (req, res, next) => {
  const { cart_id } = req.body;
  try {
    if (!checkId(cart_id)) {
      throw createError("cart_id is not valid");
    }

    const cartItem = await Cart.findById(cart_id);

    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await cartItem.save();
        successRes(res, 201, { message: "1 item removed" });
      } else {
        throw createError("You should have at leasts one item!");
      }
    } else {
      throw createError("Cart item not found!");
    }
  } catch (error) {
    next(error);
  }
};

// Get all cart items
exports.getAllCarts = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    if (!checkId(user_id)) {
      throw createError("user_id is not valid");
    }
    const cartItems = await Cart.find({ user_id }).populate("product");
    successRes(res, 201, { cart: cartItems });
  } catch (error) {
    next(error);
  }
};

// Delete items
exports.deleteCart = async (req, res, next) => {
  const { cart_id } = req.params;
  try {
    if (!checkId(cart_id)) {
      throw createError("cart_id is not valid");
    }
    await Cart.findByIdAndDelete(cart_id);
    successRes(res, 201);
  } catch (error) {
    next(error);
  }
};
