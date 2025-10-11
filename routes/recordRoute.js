const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");

router
  .route("/")
  .post(recordController.createAttendance)
  .get(recordController.getAllAttendance)
  .delete(recordController.deleteAllAttendance);

router
  .route("/:id")
  .get(recordController.getAttendanceById)
  .patch(recordController.updateAttendanceById)
  .delete(recordController.deleteAttendanceById);

router.route("/user/:id").get(recordController.getAttendanceByUserId);

module.exports = router;
