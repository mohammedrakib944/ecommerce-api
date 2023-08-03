const { unlink } = require("fs");
const createError = require("http-errors");
const { ImageDirectory } = require("../secret");

/**
 * @param {String} imageName
 */
const deleteImage = async (imageName) => {
  const filePath = `${ImageDirectory}/${imageName}`;
  unlink(filePath, (err) => {
    if (err) {
      console.log("Image delete error: ", err.message);
    }
  });
};

module.exports = deleteImage;
