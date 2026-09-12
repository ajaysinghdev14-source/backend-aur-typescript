import User from "./user.model.js";
import ApiError from "../../common/utils/api-error.js";
import { generateResetToken } from "../../common/utils/jwt.utils.js";

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

export { register };
