const bcrypt = require("bcrypt");

/**
 * @param {String} password
 * @returns promiss hashedPassword
 */

const hashPassword = async (password) => {
  // Generate a salt for hashing
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the salt
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

module.exports = hashPassword;
