import jwt from "jsonwebtoken";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export default { generateAccessToken, generateRefreshToken }