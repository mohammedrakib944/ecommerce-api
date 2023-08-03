const express = require("express");
const router = express.Router();
const multer = require("multer");
const validationOutput = require("../validator");
const authValidator = require("../validator/auth.validator");
const { login } = require("../controllers/auth.controller");

router.post("/login", multer().none(), authValidator, validationOutput, login);

module.exports = router;
