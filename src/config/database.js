const mongoose = require("mongoose");
const { mongoDBURI } = require("../secret");

// DATABASE SETUP
const connectDB = async () => {
  try {
    await mongoose.connect(mongoDBURI);
    console.log("DB connected!");
  } catch (err) {
    console.log("DB error: ", err);
  }
};

module.exports = connectDB;
