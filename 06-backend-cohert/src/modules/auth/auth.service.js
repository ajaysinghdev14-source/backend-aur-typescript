import User from "./user.model.js";
import ApiError from "../../common/utils/api-error.js";
import { generateResetToken } from "../../common/utils/jwt.utils.js";

const register = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    throw ApiError.conflict("Email already exists");
  }

  const { rawtoken, hashedToken } = generateResetToken();

  await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: "user",
    resetToken: hashedToken,
    resetTokenExpiry: Date.now() + 3600000, // 1 hour from now
  });

  const newUser = await User.create(userData);
  return newUser;
};

export { register };
