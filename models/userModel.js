const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: "defaultProfile.jpg", //default image inside the server for avatar before user assigned one
  },
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "phone number is required"],
    trim: true,
  },
  rollNumber: {
    type: String,
    required: [true, "roll number is required"],
  },
  year: {
    type: String,
    required: [true, "attending is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  role: {
    type: String,
    default: "student",
    enum: {
      values: ["admin", "student"],
      message: `role must be "admin" or "student"`,
    },
  },
  haveFaceSample: {
    //face image to sample when autheticating
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
