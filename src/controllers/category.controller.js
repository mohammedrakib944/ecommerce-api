const createError = require("http-errors");
const checkId = require("../helpers/checkID");
const successRes = require("../helpers/success.response");
const Category = require("../models/category.model");

// CREATE CATEGORY
exports.createCategory = async (req, res, next) => {
  try {
    if (!checkId(req.body.user_id)) {
      throw createError("user_id is not valid!");
    }
    const response = await Category.create(req.body);
    successRes(res, 200, response);
  } catch (err) {
    next(err);
  }
};

// GET CATEGORY
exports.getCategory = async (req, res, next) => {
  try {
    // const search = req.query.search || "";
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 5;

    // const searchRegExp = new RegExp(".*" + search + ".*", "i");

    // const filter = {
    //   $or: [{ category_name: { $regex: searchRegExp } }],
    // };

    // // Searching
    // const response = await Category.find(filter)
    //   .limit(limit)
    //   .skip((page - 1) * limit);

    // if (!response || response.length < 1) {
    //   throw createError(404, "No user found!");
    // }

    // const totalCategory = await Category.find(filter).countDocuments();

    // successRes(res, 200, {
    //   pagination: {
    //     totalPages: Math.ceil(totalCategory / limit),
    //     currentPage: page,
    //     previousPage: page - 1 > 0 ? page - 1 : null,
    //     nextPage:
    //       page + 1 <= Math.ceil(totalCategory / limit) ? page + 1 : null,
    //   },
    //   category: response,
    // });

    const totalCategory = await Category.find();
    successRes(res, 200, { category: totalCategory });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE Category
exports.getSingleCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!checkId(id)) {
      throw createError("Id is not valid!");
    }
    const response = await Category.findById(id);
    successRes(res, 200, response);
  } catch (err) {
    next(err);
  }
};

// UPDATE Category
exports.updateCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!checkId(id)) {
      throw createError("Id is not valid!");
    }
    const response = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    successRes(res, 200, response);
  } catch (err) {
    next(err);
  }
};

// DELETE Category
exports.deleteCategory = async (req, res, next) => {
  const category_id = req.params.id;
  try {
    if (!checkId(category_id)) {
      throw createError("Id is not valid!");
    }
    const response = await Category.findByIdAndDelete(category_id);
    if (!response) {
      throw createError("Could not delete!");
    }
    successRes(res, 200);
  } catch (err) {
    next(err);
  }
};
