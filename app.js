const express = require("express");
const morgan = require("morgan");
const authRoute = require("./routes/authRoute");
const errorController = require("./controllers/errorController");

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRoute);

app.use(errorController.globalErrorController);

module.exports = app;
