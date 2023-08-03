const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  images: [{ type: String }],
});

const ProductImage = mongoose.model("Image", imagesSchema);

module.exports = ProductImage;
