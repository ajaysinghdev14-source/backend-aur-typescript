import User from "./user.model.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import { valid } from "joi";
import { verify } from "jsonwebtoken";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const register = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    throw ApiError.conflict("Email already exists");
  }

  const { rawtoken, hashedToken } = generateResetToken();

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: "user",
    verificationToken: hashedToken,
  });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;

  // TODO: send an email to user with token: rawToken

  return userObj;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("User not found");
  }

  // assume some how i will check password - we will come later on this

  if (!user.isVerified) {
    throw ApiError.forbidden("User not verified");
  }

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token is required");
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) {
    throw ApiError.unauthorized("User not found");
  }

  if (user.refreshToken !== hashToken(refreshToken)) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateAccessToken({ id: user._id });
  const newRefreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, {
    refreshToken: null,
  });

  if (!user) {
    throw ApiError.unauthorized("User not found");
  }
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const { rawtoken, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins from now

  await user.save({ validateBeforeSave: false });

  // TODO: send an email to user with the raw reset token: rawtoken
};

export { register, login, refresh, logout, forgotPassword };
