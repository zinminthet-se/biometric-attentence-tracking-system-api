const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.route("/signup").post(adminController.createAdmin);

router
  .route("/")
  .get(adminController.getAllAdmins)
  .delete(adminController.deleteAllAdmins);

router
  .route("/:id")
  .get(adminController.getAdminById)
  .patch(adminController.updateAdminById)
  .delete(adminController.deleteAdminById);

module.exports = router;
