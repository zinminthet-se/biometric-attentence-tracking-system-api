const jwt = require("jsonwebtoken");

exports.generateToken = ({ id, role }) => {
  const token = jwt.sign(
    {
      user_id: id,
      role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};
