const mongoose = require("mongoose");
const { defaultImagePath } = require("../secret");

const userSchema = new mongoose.Schema({
  //-----user input-----
  name: {
    trim: true,
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  //-----user input-----
  image: {
    type: String,
    default: defaultImagePath,
  },
  city: {
    type: String,
  },
  postal_code: {
    type: String,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  is_banned: {
    type: Boolean,
    defalut: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
