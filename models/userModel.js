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
    select: false,
  },
  role: {
    type: String,
    default: "student",
  },
  haveFaceSample: {
    //face image to sample when autheticating
    type: Number,
    default: 0,
  },
  university: {
    type: String,
    default: "UCSMDY",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.checkPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
