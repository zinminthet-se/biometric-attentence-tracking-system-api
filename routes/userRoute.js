const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/signup").post(userController.createUser);

router
  .route("/")
  .get(userController.getAllUsers)
  .delete(userController.deleteAllUsers);
router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
