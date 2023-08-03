const jwt = require("jsonwebtoken");
const createError = require("http-errors");

/**
 * @param {Object} payload
 * @param {String} secretKey
 * @param {String} expiresIn '10m'
 * @returns token
 */

const createJWT = (payload, secretKey, expiresIn = "10d") => {
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (err) {
    console.log("Err -> ", err);
    throw createError("Cann't create JWT");
  }
};

module.exports = createJWT;
