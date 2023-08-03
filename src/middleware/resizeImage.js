const sharp = require("sharp");
const { ImageDirectory } = require("../secret");

// SECOND MIDDLEWARE
const resizeImage = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(500, 400)
        .toFormat("jpeg")
        .jpeg({ quality: 60 })
        .toFile(`${ImageDirectory}/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
};

module.exports = resizeImage;
