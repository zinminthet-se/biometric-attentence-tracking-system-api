const User = require("../models/userModel");
const AppError = require("../utilities/AppError");
const catchAsync = require("../utilities/catchAsync");
const FormError = require("../utilities/FormError");
const { generateToken } = require("../utilities/jwtUtil");
const STATUS_CODES = require("../utilities/StatusCode");

exports.adminLogin = catchAsync(async (req, res, next) => {
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

  const user = await User.findOne({
    name,
    role: { $eq: "admin" },
  }).select("+password");

  if (!user)
    return next(new AppError("User is not found", STATUS_CODES.BAD_REQUEST));

  const isCorrectPassword = await user.checkPassword(password, user.password);
  if (!isCorrectPassword)
    return next(
      new AppError(
        "username or password is not correct",
        STATUS_CODES.BAD_REQUEST
      )
    );

  const token = generateToken(user.id);

  console.log("this is a token", token);

  return res.status(STATUS_CODES.OK).json({
    status: "success",
    user,
  });
});

exports.userLogin = catchAsync(async (req, res, next) => {
  const { rollNumber, password } = req.body;
  const user = await User.findOne({
    $or: [{ rollNumber: rollNumber }, { name: rollNumber }],
  });

  if (!user) console.log("user not found");

  res.status(201).json({
    status: "success",
    user,
  });
});

exports.signUp = async (req, res, next) => {
  const requiredFields = [
    "name",
    "password",
    "rollNumber",
    "year",
    "phone",
    "email",
    "role",
  ];
  const missingFieldMessages = {};
  const { name, password, rollNumber, year, phone, email, role } =
    req.body || {};

  requiredFields.forEach((field) => {
    if (!req.body || !req.body[field]) {
      missingFieldMessages[field] = `${field} is missing`;
    }
  });

  if (Object.keys(missingFieldMessages).length > 0) {
    console.log("got called form error");
    return next(
      new FormError(
        "Missing Fields",
        STATUS_CODES.BAD_REQUEST,
        missingFieldMessages
      )
    );
  }

  const imagePath = req.file ? req.file.path : "defaultProfile.jpg";
  console.log(imagePath);

  const userData = {
    // profileImage,
    phoneNumber: phone,
    email: email,
    role,
    name,
    password,
    rollNumber,
    year,
  };

  const existingUser = await User.findOne({ rollNumber });
  if (existingUser)
    return next(
      new AppError(
        "User with this roll number exists!",
        STATUS_CODES.BAD_REQUEST
      )
    );

  const newUser = await User.create(userData);

  res.status(200).json({
    status: "signup ",
  });
};
