import User from "./user.model.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";

const hashToken = (token) => {
  // Store only a one-way hash of refresh tokens so the original token is not
  // exposed if the database is compromised.
  return crypto.createHash("sha256").update(token).digest("hex");
};

const register = async (userData) => {
  // Prevent more than one account from being created with the same email.
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    throw ApiError.conflict("Email already exists");
  }

  // Generate a verification token. The raw token is intended for the email;
  // only its hash is persisted in the database.
  const { rawtoken, hashedToken } = generateResetToken();

  // Create the account with the default user role and as-yet-unverified status.
  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: "user",
    verificationToken: hashedToken,
  });

  // Return a safe representation of the user and omit sensitive fields.
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;

  // TODO: send an email to the user containing the raw verification token.

  return userObj;
};

const login = async ({ email, password }) => {
  // Explicitly select the password because it is normally excluded by the model.
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("User not found");
  }

  // Compare the supplied password with the stored hash.
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  // Unverified accounts cannot obtain authentication tokens.
  if (!user.isVerified) {
    throw ApiError.forbidden("User not verified");
  }

  // Issue a short-lived access token and a longer-lived refresh token.
  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Persist only the refresh-token hash so it can be checked during renewal.
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  // Do not expose credentials or the stored refresh-token hash to the client.
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  // A refresh request must include the token issued during login.
  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token is required");
  }

  // Verify the token signature and extract the user ID from its payload.
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) {
    throw ApiError.unauthorized("User not found");
  }

  // Validate both the token signature and the token currently stored for the user.
  if (user.refreshToken !== hashToken(refreshToken)) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  // Rotate both tokens so the old refresh token cannot be reused.
  const accessToken = generateAccessToken({ id: user._id });
  const newRefreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  // Return the refreshed session without exposing sensitive model fields.
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
  // Invalidating the stored refresh token logs the user out on all future refreshes.
  const user = await User.findByIdAndUpdate(userId, {
    refreshToken: null,
  });

  if (!user) {
    throw ApiError.unauthorized("User not found");
  }
};

const forgotPassword = async (email) => {
  // Find the account that requested a password reset.
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  // Create a reset token and limit its validity to 15 minutes.
  // As with verification, only the hash is stored in the database.
  const { rawtoken, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins from now

  await user.save({ validateBeforeSave: false });

  // TODO: send an email to the user containing the raw reset token.
};

const getMe = async (userId) => {
  // Retrieve the authenticated user's profile information.
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  // Remove sensitive fields before returning the user object.
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return userObj;
};

export { register, login, refresh, logout, forgotPassword, getMe };
