const { validationResult } = require("express-validator");

// input validation Result
const validationOutput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errMessages = "";
    errors.errors.map((error) => (errMessages += error.msg + " ,"));
    throw new Error(errMessages);
  }
  next();
};

module.exports = validationOutput;
