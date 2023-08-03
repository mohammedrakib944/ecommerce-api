const createError = require("http-errors");
const checkId = require("../helpers/checkID");
const successRes = require("../helpers/success.response");
const Product = require("../models/product.model");
const User = require("../models/user.model");

// SAVE PRODUCT
exports.uploadProduct = async (req, res, next) => {
  try {
    if (!checkId(req.body.user_id)) {
      throw createError("user_id is not valid!");
    }

    const user = await User.findById(req.body.user_id);

    if (!user) {
      throw createError("No user found!");
    }

    const response = await Product.create(req.body);
    successRes(res, 200, response);
  } catch (err) {
    next(err);
  }
};

// GET PRODUCTS
exports.getProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [
        { product_name: { $regex: searchRegExp } },
        { category: { $regex: searchRegExp } },
      ],
    };

    // Searching
    const response = await Product.find(filter)
      .limit(limit)
      .skip((page - 1) * limit);

    const totalProducts = await Product.find(filter).countDocuments();

    if (!response || response.length < 1) {
      throw createError(404, "No user found!");
    }

    successRes(res, 200, {
      pagination: {
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage:
          page + 1 <= Math.ceil(totalProducts / limit) ? page + 1 : null,
      },
      products: response,
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE PRODUCTS
exports.getSingleProduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!checkId(id)) {
      throw createError("Id is not valid!");
    }
    const response = await Product.findById(id);
    successRes(res, 200, response);
  } catch (err) {
    next(err);
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!checkId(id)) {
      throw createError("Id is not valid!");
    }
    const response = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    successRes(res, 200, response);
  } catch (err) {
    next(err);
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!checkId(id)) {
      throw createError("Id is not valid!");
    }
    await Product.findByIdAndDelete(id);
    successRes(res, 200);
  } catch (err) {
    next(err);
  }
};
