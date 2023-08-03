const express = require("express");
const router = express.Router();
const multer = require("multer");
const validationOutput = require("../validator");
const userValidator = require("../validator/user.validator");
const {
  verifyUser,
  createUser,
  createUserUsingGoogle,
  getAllUsers,
  getSingleAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

// Check authentication using this middleware
const authChecker = require("../middleware/auth.checker");

// api/users/verify [send email to user]
router.post(
  "/verify",
  multer().none(),
  userValidator,
  validationOutput,
  verifyUser
);

// create user using google auth
// /api/users/google-auth
router.post("/google-auth", createUserUsingGoogle);

// /api/users/
// multer().none() for recieve form-data
router.route("/").get(getAllUsers).post(createUser);

router
  .route("/:id")
  .get(getSingleAllUsers)
  .patch(multer().none(), updateUser)
  .delete(deleteUser);

module.exports = router;
