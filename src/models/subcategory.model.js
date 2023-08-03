const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  category_id: {
    type: String,
    required: true,
  },
  category_name: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["show", "hide"],
    default: "show",
  },
});

const Category = mongoose.model("SubCategory", subCategorySchema);
module.exports = Category;
