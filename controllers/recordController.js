const Record = require("../models/recordModel");
const User = require("../models/userModel");
const AppError = require("../utilities/AppError");
const catchAsync = require("../utilities/catchAsync");
const FormError = require("../utilities/FormError");
const STATUS_CODES = require("../utilities/StatusCode");

exports.getAttendanceByUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params || undefined;
  const userExists = await User.findById(id);
  if (!userExists)
    return next(new AppError("The user doeesn't exists anymore"));

  const user_id = userExists._id;
  const records = await Record.find({ user: user_id });
  return res.status(STATUS_CODES.OK).json({
    status: "success",
    message: `attendance of user id:${user_id} got fetched`,
    data: {
      count: records.length,
      records,
    },
  });
});

exports.createAttendance = catchAsync(async (req, res, next) => {
  const attendanceData = {};
  const requiredFields = ["user_id", "status"];

  const missingFieldMessages = {};
  requiredFields.forEach((field) => {
    if (!req.body || !req.body[field]) {
      missingFieldMessages[field] = `${field} is missing`;
    } else {
      attendanceData[field] = req.body[field];
    }
  });

  console.log(missingFieldMessages);

  if (Object.keys(missingFieldMessages).length > 0) {
    return next(
      new FormError(
        "Missing required fields",
        STATUS_CODES.BAD_REQUEST,
        missingFieldMessages
      )
    );
  }

  const userExists = await User.findById(attendanceData["user_id"]);
  if (!userExists)
    return next(
      new AppError("User who is making an attendance doesn't exists anymore")
    );

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log(formattedDate);
  const recordData = {
    user: attendanceData.user_id,
    status: attendanceData.status,
    date: formattedDate,
  };

  const newAttendance = await Record.create({ ...recordData });

  return res.status(STATUS_CODES.CREATED).json({
    status: "success",
    message: `Attendance for user '${userExists.name} is created. Status: '${newAttendance["status"]}'`,
  });
});

exports.getAllAttendance = catchAsync(async (req, res, next) => {
  const records = await Record.find().populate("user");
  console.log(records);
  return res.status(STATUS_CODES.OK).json({
    status: "success",
    message: "all attendaces got fetched",
    data: {
      count: records.length,
      records,
    },
  });
});

exports.getAttendanceById = catchAsync(async (req, res, next) => {
  const { id } = req.params || undefined;
  const foundRecord = await Record.findById(id);
  return res.status(STATUS_CODES.OK).json({
    status: "success",
    message: `Record with ${id} got fetched`,
    data: {
      foundRecord,
    },
  });
});

exports.updateAttendanceById = catchAsync(async (req, res, next) => {
  const { id } = req.params || undefined;
  const allowedFields = ["status"];

  const missingFieldMessages = {};
  const updatedData = {};
  allowedFields.forEach((field) => {
    if (!req.body[field] || !req.body) {
      missingFieldMessages[field] = `${field} is missing`;
    } else {
      updatedData[field] = req.body[field];
    }
  });

  if (Object.keys(missingFieldMessages > 0)) {
    return next(
      new FormError(
        "Missing required fields",
        STATUS_CODES.BAD_REQUEST,
        missingFieldMessages
      )
    );
  }

  const updatedRecord = await Record.findByIdAndUpdate(id, updatedData, {
    new: true,
  });
  return res.status(STATUS_CODES.OK).json({
    status: "success",
    message: `Record with ${id} got updated`,
    data: {
      updatedRecord,
    },
  });
});

exports.deleteAttendanceById = catchAsync(async (req, res, next) => {
  const { id } = req.params || undefined;
  await Record.findByIdAndDelete(id);
  return res.status(STATUS_CODES.NO_CONTENT).json({
    status: "success",
    message: `Record with ${id} got deleted`,
  });
});

exports.deleteAllAttendance = catchAsync(async (req, res, next) => {
  await Record.deleteMany();
  return res.status(STATUS_CODES.NO_CONTENT).json({
    status: "success",
    message: "all records have been deleted",
  });
});
