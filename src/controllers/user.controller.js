const User = require("../models/user.model");
const mongoose = require("mongoose");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const hashPassword = require("../helpers/hashPassword");
const successRes = require("../helpers/success.response");
const createJWT = require("../helpers/createJWT");
const checkId = require("../helpers/checkID");
const { jwtSecrt, clientURL } = require("../secret");
const sendEmailWithNodeMailer = require("../helpers/nodeEmail");

// VERIFY USER by sending email
exports.verifyUser = async (req, res, next) => {
  try {
    const { email, phone, password, ...rest } = req.body;

    const doesEmailExist = await User.findOne({ email });
    const doesPhoneExist = await User.findOne({ phone });

    if (doesEmailExist) {
      throw createError("Email already taken!");
    }

    if (doesPhoneExist) {
      throw createError("This phone number already taken!");
    }

    // Create JWT
    const token = createJWT(req.body, jwtSecrt, "10m");

    // prepare email
    const emailData = {
      email,
      subject: "Account verification email",
      html: `
      <h2> Hello ${req.body.name} </h2>
      <b> Please click the link bellow: <b/>
      <br />
      <h3> <a href="${clientURL}/users/verification/${token}" target="_blank">Verify your email </a>  </h3>
     `,
    };

    // send email with nodemailer
    await sendEmailWithNodeMailer(emailData);

    successRes(res, 200, {
      message: `Go to your email (${email}) and verify`,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE USER using credientials
exports.createUser = async (req, res, next) => {
  const { token } = req.body;

  try {
    if (!token) {
      throw createError("No token found!");
    }
    const decode = await jwt.verify(token, jwtSecrt);
    const { name, email, phone, address, password } = decode;

    const doesEmailExist = await User.findOne({ email });
    if (doesEmailExist) {
      throw createError("Email already taken!");
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const useData = {
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    };

    // Save to database
    const response = await User.create(useData);
    const { password: passcode, ...rest } = response.toObject();
    // Send response
    successRes(res, 200, { user: rest });
  } catch (err) {
    next(err);
  }
};

// CREATE USER using Google Auth
exports.createUserUsingGoogle = async (req, res, next) => {
  const { email, name, image } = req.body;

  try {
    if (!email || !name) {
      throw createError("Can't create user!");
    }
    const user = await User.findOne({ email });
    // Create JWT
    const token = createJWT({ email }, jwtSecrt);

    if (user) {
      successRes(res, 201, { user, access_token: token });
    } else {
      // Save to database
      const response = await User.create(req.body);
      const { password: passcode, ...rest } = response.toObject();
      // Send response
      successRes(res, 201, { user: rest, access_token: token });
    }
  } catch (err) {
    next(err);
  }
};

// GET USERS
exports.getAllUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    // Don't send password
    const options = { password: 0 };

    // Searching
    const response = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const totalUsers = await User.find(filter).countDocuments();

    if (!response || response.length < 1) {
      throw createError(404, "No user found!");
    }

    successRes(res, 200, {
      pagination: {
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(totalUsers / limit) ? page + 1 : null,
      },
      users: response,
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE USER
exports.getSingleAllUsers = async (req, res, next) => {
  const id = req.params.id;
  try {
    // Check mondodb ID
    if (!checkId(id)) {
      throw createError("Id is not valid!");
    }
    // Don't send password
    const options = { password: 0 };
    const response = await User.findById(id, options);
    // If no user found
    if (!response || response.length < 1) {
      throw createError("No user found!");
    }

    // send response
    successRes(res, 200, { user: response });
  } catch (err) {
    next(err);
  }
};

// UPDATE USER
exports.updateUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    // Check mondodb ID
    if (!checkId(id)) {
      throw createError("Id is not valid!");
    }
    const { email, ...rest } = req.body;
    const response = await User.findByIdAndUpdate(
      id,
      rest,
      { new: true, select: "-password" },
      { password: 0 }
    );
    // Could not update user!
    if (!response || response.length === 0) {
      throw createError("Could not update user!");
    }
    // send response
    successRes(res, 200, { user: response });
  } catch (err) {
    next(err);
  }
};

// DELETE USER
exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    // Check mondodb ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id is not valid!");
    }
    const response = await User.findByIdAndDelete(id);
    // If no user found
    if (!response) {
      throw createError("Couldn't delete!");
    }
    // Send response
    successRes(res, 200);
  } catch (err) {
    next(err);
  }
};
