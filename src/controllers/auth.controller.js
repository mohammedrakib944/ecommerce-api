const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const createJWT = require("../helpers/createJWT");
const successRes = require("../helpers/success.response");

// LOGIN
exports.login = async (req, res, next) => {
  const { phone, password } = req.body;

  try {
    // Find user with the provided phone
    const user = await User.findOne({ phone });
    if (!user) {
      throw createError("No user found!");
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createError("Invalid credentials");
    }

    // Generate a JWT token
    const token = createJWT({ name: user.name }, process.env.JWT_SECRET, "10m");

    const { password: passcode, ...rest } = user.toObject();

    // Send response
    successRes(res, 200, {
      user: rest,
      access_token: token,
    });
  } catch (err) {
    next(err);
  }
};
