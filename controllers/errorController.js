const handleJwtError = (err) => {
  err.isOperational = true;
  err.message = "Token is invalid";
  return err;
};

const handleCastError = (err) => {
  err.isOperational = true;
  err.message = "Invalid url parameter is detected";
  return err;
};

const sendErrorProduction = (err, req, res, next) => {
  // operational errors
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).json({
      error: { message: err.message, ...err },
    });
  }

  // non-operational errors
  res.status(500).json({
    status: "error",
    message: "Something went very wrong",
  });
};

const sendErrorDevelopement = (err, req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
};

exports.globalErrorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    sendErrorDevelopement(err, req, res, next);
  } else if (process.env.NODE_ENV == "production") {
    //custom error handlings
    //placeholders
    let error = { ...err, name: err.name };
    if (error.name == "JsonWebTokenError") {
      error = handleJwtError(error);
    }
    console.log(error);
    if (error.name == "CastError") {
      error = handleCastError(error);
    }
    sendErrorProduction(error, req, res);
  }
};
