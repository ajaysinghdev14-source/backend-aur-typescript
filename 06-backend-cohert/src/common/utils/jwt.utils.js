import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

const generateResetToken = () => {
  const rawtoken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawtoken)
    .digest("hex");

  return { rawtoken, hashedToken };
};

export {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
};
