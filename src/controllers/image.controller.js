const createError = require("http-errors");
const checkId = require("../helpers/checkID");
const successRes = require("../helpers/success.response");
const deleteImage = require("../helpers/deleteImage");
const ProductImage = require("../models/image.modal");

// Upload Products Image
exports.uploadImages = async (req, res, next) => {
  const user_id = req.params.user_id;
  const images = req.body.images;

  try {
    if (!images) {
      throw createError("images is requried!");
    }
    const productImages = await ProductImage.findOne({ user_id });
    if (!productImages && images.length > 0) {
      // If collection found -> create
      const result = await ProductImage.create({ user_id, images });
      successRes(res, 201, { products_image: result.images });
    } else if (productImages && images.length > 0) {
      // If there is a already a collection -> update
      const result = await ProductImage.findOneAndUpdate(
        { user_id },
        { images: [...images, ...productImages.images] },
        { new: true }
      );
      successRes(res, 201, { products_image: result.images });
    } else {
      throw createError("No image found!");
    }
  } catch (err) {
    next(err);
  }
};

exports.getProductImages = async (req, res, next) => {
  const user_id = req.params.user_id;
  try {
    // Check mongodb ID
    if (!checkId(user_id)) {
      throw createError("user_id is not valid!");
    }
    const { images } = await ProductImage.findOne({ user_id });
    successRes(res, 201, { products_image: images });
  } catch (err) {
    next(err);
  }
};

// Delete product Image
exports.deleteProductImage = async (req, res, next) => {
  const user_id = req.params.user_id;
  const { image_name } = req.body;
  try {
    // Check mongodb ID
    if (!checkId(user_id)) {
      throw createError("user_id is not valid!");
    }

    if (!image_name) {
      throw createError("image not found!");
    }

    const { images } = await ProductImage.findOne({ user_id });
    if (images) {
      const newImages = images.filter((img) => img !== image_name);
      await ProductImage.findOneAndUpdate({ user_id }, { images: newImages });
      await deleteImage(image_name);
      successRes(res, 201);
    } else {
      throw createError("No images found!");
    }
  } catch (err) {
    next(err.message);
  }
};
