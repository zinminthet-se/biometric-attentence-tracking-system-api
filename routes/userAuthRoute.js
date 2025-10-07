const express = require("express");
const router = express.Router();
const userAuthController = require("../controllers/userAuthController");

router.route("/login").post(userAuthController.login);

module.exports = router;
