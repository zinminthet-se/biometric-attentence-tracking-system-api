const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const AppError = require("../utilities/AppError");
const catchAsync = require("../utilities/catchAsync");
const FormError = require("../utilities/FormError");
const { generateToken } = require("../utilities/jwtUtil");
const STATUS_CODES = require("../utilities/StatusCode");

exports.login = catchAsync(async (req, res, next) => {
  const requiredFields = ["rollNumber", "password"];
  const missingFieldMessages = {};
  const { rollNumber, password } = req.body || {};

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

  const user = await User.findOne({
    $or: [{ rollNumber: rollNumber }, { name: rollNumber }],
  });

  if (!user)
    return next(
      new AppError("User is not registered", STATUS_CODES.BAD_REQUEST)
    );

  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json({
    status: "success",
    token: token,
    data: {
      user,
    },
  });
});
