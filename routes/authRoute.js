const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/admin/login").post(authController.adminLogin);

router.route("/login").post(authController.userLogin);
router.route("/signup").post(authController.signUp);

module.exports = router;
