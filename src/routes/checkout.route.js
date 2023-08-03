const express = require("express");
const router = express.Router();
const { setPaymentDone } = require("../controllers/checkout.controller");

// Check authentication using this middleware
const authChecker = require("../middleware/auth.checker");

// api/checkout
router.route("/:id").post(setPaymentDone);

module.exports = router;
