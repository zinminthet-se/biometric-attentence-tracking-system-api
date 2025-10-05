const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: "defaultProfile.jpg",
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "phone number is required"],
  },
  role: {
    type: String,
    required: [true, "role is required"],
    default: "admin",
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 14);
  next();
});

adminSchema.methods.checkPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
