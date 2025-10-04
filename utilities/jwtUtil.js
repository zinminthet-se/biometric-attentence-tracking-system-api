const jwt = require("jsonwebtoken");

exports.generateToken = ({ id }) => {
  const token = jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};
