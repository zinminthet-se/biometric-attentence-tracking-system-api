const Admin = require("../models/adminModel");
const AppError = require("../utilities/AppError");
const catchAsync = require("../utilities/catchAsync");
const FormError = require("../utilities/FormError");
const { generateToken } = require("../utilities/jwtUtil");
const STATUS_CODES = require("../utilities/StatusCode");

exports.login = catchAsync(async (req, res, next) => {
  const requiredFields = ["name", "password"];
  const missingFieldMessages = {};
  const { name, password } = req.body || {};

  requiredFields.forEach((field) => {
    if (!req.body || !req.body[field]) {
      missingFieldMessages[field] = `${field} is missing`;
    }
  });

  if (Object.keys(missingFieldMessages).length > 0) {
    return next(
      new FormError(
        "Missing Fields",
        STATUS_CODES.BAD_REQUEST,
        missingFieldMessages
      )
    );
  }

  const admin = await Admin.findOne({
    name,
    role: { $eq: "admin" },
  }).select("+password");

  console.log("this is admin", admin);

  if (!admin)
    return next(new AppError("Admin is not found", STATUS_CODES.BAD_REQUEST));

  const isCorrectPassword = await admin.checkPassword(password, admin.password);
  if (!isCorrectPassword)
    return next(
      new AppError(
        "admin name or password is not correct",
        STATUS_CODES.BAD_REQUEST
      )
    );

  console.log(admin);
  const token = generateToken(admin._id, admin.role);

  return res.status(STATUS_CODES.OK).json({
    status: "success",
    token,
    data: {
      admin: admin,
    },
  });
});

exports.forgotPassword = (req, res, next) => {
  return res.status(200).json({
    status: "forgot",
  });
};

exports.deleteAccount = (req, res, next) => {};
