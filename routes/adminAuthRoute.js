const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");

router.route("/login").post(adminAuthController.login);
// router.route("/signup").post(adminAuthController.signUp);
router.route("/forgot_password").post(adminAuthController.forgotPassword);

module.exports = router;
