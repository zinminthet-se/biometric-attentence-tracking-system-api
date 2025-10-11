const AppError = require("../utilities/AppError");
const catchAsync = require("../utilities/catchAsync");
const STATUS_CODES = require("../utilities/StatusCode");

exports.isAcceptedRole = (role) => {
  return catchAsync(async (req, res, next) => {
    if (req.isLoggedIn && req.user_role === role) {
      // cleanup for added properties starts
      delete req.isLoggedIn;
      delete req.role;
      // cleanup for added properties ends
      return next();
    } else {
      return next(
        new AppError("Unauthorized Access", STATUS_CODES.UNAUTHORIZED)
      );
    }
  });
};
