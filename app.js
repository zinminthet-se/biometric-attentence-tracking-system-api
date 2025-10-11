const express = require("express");
const morgan = require("morgan");
const adminAuthRoute = require("./routes/adminAuthRoute");
const userAuthRoute = require("./routes/userAuthRoute");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const errorController = require("./controllers/errorController");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const catchAsync = require("./utilities/catchAsync");
const recordRoute = require("./routes/recordRoute");

const app = express();

app.use(express.json());
app.use(cors());

app.use(morgan("dev"));

app.get(
  "/test/jwt",
  catchAsync(async (req, res, next) => {
    const token = jwt.sign(
      { user_id: 12, role: "admin" },
      process.env.JWT_SECRET_KEY
    );
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      console.log("payload", payload);
      console.log("error", err);
    });

    return res.status(200).json({
      status: "test",
      message: "testing jwt",
    });
  })
);

app.use("/api/auth/user", userAuthRoute);
app.use("/api/auth/admin", adminAuthRoute);

app.use("/api/users", userRoute);
app.use("/api/admins", adminRoute);

app.use("/api/records", recordRoute);

app.use(errorController.globalErrorController);

module.exports = app;
