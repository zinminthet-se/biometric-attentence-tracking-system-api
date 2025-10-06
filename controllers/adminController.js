const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const AppError = require("../utilities/AppError");
const catchAsync = require("../utilities/catchAsync");
const FormError = require("../utilities/FormError");
const STATUS_CODES = require("../utilities/StatusCode");

exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find();
  if (!admins)
    return next(
      new AppError(
        "Data avaiability got corrupted, contact to the api developer"
      )
    );
  return res.status(STATUS_CODES.OK).json({
    status: "success",
    message: "all admins got fetched",
    count: admins.length,
    data: {
      admins,
    },
  });
});
exports.getAdminById = catchAsync(async (req, res, next) => {
  const { id } = req.params || undefined;
  const foundAdmin = await Admin.findById(id);
  if (!foundAdmin) return next(new AppError(`Admin with ${id} not found`));
  return res.status(200).json({
    status: "success",
    message: `Admin with ${id} got fetched`,
    data: {
      foundAdmin,
    },
  });
});
exports.deleteAdminById = catchAsync(async (req, res, next) => {
  const { id } = req.params || undefined;
  const foundAdmin = await Admin.findById(id);
  if (!foundAdmin)
    return next(new AppError("User does not exists", STATUS_CODES.BAD_REQUEST));

  const deleted = await User.findByIdAndDelete(id);

  return res.status(STATUS_CODES.NO_CONTENT).json({
    status: "success",
    message: `User with ${id} got deleted`,
  });
});

exports.bulkDeleteAdmins = (req, res, next) => {};
exports.updateAdminById = catchAsync(async (req, res, next) => {
  const allowedFileds = ["name", "email", "phoneNumber", "password"];
  const { id } = req.params || undefined;
  const doesExists = await Admin.findById(id);
  if (!doesExists)
    return next(
      new AppError("Admin does not exists", STATUS_CODES.BAD_REQUEST)
    );

  const adminDataToBeUpdated = {};

  allowedFileds.forEach((field) => {
    if (req.body[field]) adminDataToBeUpdated[field] = req.body[field];
  });

  const updatedUser = await User.findByIdAndUpdate(id, adminDataToBeUpdated, {
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

exports.createAdmin = async (req, res, next) => {
  const requiredFields = ["name", "password", "phoneNumber", "email"];
  const missingFieldMessages = {};
  const { name, password, phoneNumber, email } = req.body || {};

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

  const adminData = {
    // profileImage,
    phoneNumber,
    email,
    name,
    password,
  };

  const existingUser =
    (await Admin.findOne({ email })) || (await User.findOne({ email }));
  if (existingUser)
    return next(
      new AppError(
        "Email has already been registerd!",
        STATUS_CODES.BAD_REQUEST
      )
    );

  const newAdmin = await Admin.create(adminData);

  res.status(STATUS_CODES.CREATED).json({
    status: "success",
    message: "Admin is created",
    data: {
      newAdmin,
    },
  });
};
