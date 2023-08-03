const multer = require("multer");
const createError = require("http-errors");
const checkId = require("../helpers/checkID");

// Image store on RAM
const storage = multer.memoryStorage();

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000, //10MB
  },
  fileFilter: (res, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      cb("You can upload only images.", false);
    }
  },
});

//FIRST MIDDLEWARE
const imageUpload = (req, res, next) => {
  const user_id = req.params.user_id;

  // IF id is not valid
  if (!checkId(user_id)) {
    throw createError("user_id is not valid!");
  }

  upload.array("images", 5)(req, res, (err) => {
    if (err) {
      console.log(err);
      let errorMessage = err.code || err || "Image upload failed - middleware";
      next(errorMessage);
    } else {
      //If everything ok, go to next middleware
      next();
    }
  });
};

module.exports = imageUpload;
