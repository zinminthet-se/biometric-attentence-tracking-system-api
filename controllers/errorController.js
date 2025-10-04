const sendErrorProduction = (err, req, res, next) => {
  // operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: { ...err },
    });
  }

  // non-operational errors
  res.status(500).json({
    status: "error",
    message: "Something went very wrong",
  });
};

const sendErrorDevelopement = (err, req, res, next) => {};

exports.globalErrorController = (err, req, res, next) => {
  if (process.env.NODE_ENV == "development") {
    sendErrorDevelopement(err, req, res, next);
  } else if (process.env.NODE_ENV == "production") {
    //custom error handlings
    //placeholders

    sendErrorProduction(err, req, res);
  }
};
