const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const AppError = require("../utilities/AppError");
const catchAsync = require("../utilities/catchAsync");
const FormError = require("../utilities/FormError");
const STATUS_CODES = require("../utilities/StatusCode");

exports.bulkDeleteUsers = (req, res, next) => {};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users)
    return next(
      new AppError(
        "Data avaiability got corrupted, contact to the api developer"
      )
    );
  return res.status(200).json({
    status: "success",
    message: "all user got fetched",
    count: users.length,
    data: {
      users,
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  console.log("got called");
  const { id } = req.params || undefined;
  if (!id) return new AppError("Parameter Error", STATUS_CODES.BAD_REQUEST);

  const user = await User.findById(id);

  if (!user)
    return next(new AppError("User not found", STATUS_CODES.BAD_REQUEST));

  return res.status(STATUS_CODES.OK).json({
    status: "success",
    message: `User with id: ${id} is fetched`,
    data: {
      user,
    },
  });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params || undefined;
  const foundUser = await User.findById(id);
  if (!foundUser)
    return next(new AppError("User does not exists", STATUS_CODES.BAD_REQUEST));

  const deleted = await User.findByIdAndDelete(id);

  return res.status(STATUS_CODES.NO_CONTENT).json({
    status: "success",
    message: `User with ${id} got deleted`,
  });
});

exports.updateUserById = catchAsync(async (req, res, next) => {
  const allowedFileds = [
    "name",
    "email",
    "phoneNumber",
    "year",
    "rollNumber",
    "password",
  ];
  const { id } = req.params || undefined;
  const doesExists = await User.findById(id);
  if (!doesExists)
    return next(new AppError("User does not exists", STATUS_CODES.BAD_REQUEST));

  const userDataToBeUpdated = {};

  allowedFileds.forEach((field) => {
    if (req.body[field]) userDataToBeUpdated[field] = req.body[field];
  });

  const updatedUser = await User.findByIdAndUpdate(id, userDataToBeUpdated, {
    new: "true",
  });

  return res.status(STATUS_CODES.OK).json({
    status: "success",
    message: `User with ${id} got updated`,
    data: {
      updatedUser,
    },
  });
});

exports.createUser = async (req, res, next) => {
  const requiredFields = [
    "name",
    "password",
    "rollNumber",
    "year",
    "phoneNumber",
    "email",
  ];

  const missingFieldMessages = {};
  const { name, password, rollNumber, year, phoneNumber, email } =
    req.body || {};

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

  const imagePath = req.file ? req.file.path : "defaultProfile.jpg";
  console.log(imagePath);

  const userData = {
    // profileImage,
    phoneNumber,
    email,
    name,
    password,
    rollNumber,
    year,
  };
  const rollNumberExists = await User.findOne({ rollNumber });

  if (rollNumberExists)
    return next(
      new AppError(`User with this roll number: ${rollNumber} already exists`)
    );

  const emailExists =
    (await Admin.findOne({ email })) || (await User.findOne({ email }));

  if (emailExists)
    return next(
      new AppError("User with this email exists!", STATUS_CODES.BAD_REQUEST)
    );

  const newUser = await User.create(userData);

  res.status(201).json({
    status: "success",
    message: "User is created",
    data: {
      newUser,
    },
  });
};

exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  await User.deleteMany();
  return res.status(STATUS_CODES.NO_CONTENT).json({
    status: "success",
    message: "all users have been deleted",
  });
});
