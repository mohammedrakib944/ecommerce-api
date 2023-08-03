const mongoose = require("mongoose");

/**
 *
 * @param {id} id
 * @returns
 */
const checkId = (id) => {
  // Check mondodb ID
  if (mongoose.Types.ObjectId.isValid(id)) {
    return true;
  } else {
    return false;
  }
};

module.exports = checkId;
