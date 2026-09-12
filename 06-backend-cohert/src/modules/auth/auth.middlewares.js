import ApiError from "../../common/utils/api-error.js";
import User from "./auth.model.js";
import { verifyAccessToken } from "./auth.utils.js";

const authenticate = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw ApiError.unauthorized("Authentication token is required");
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized("User not found");
  }
  req.user = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  };
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        "You are not authorized to access this resource",
      );
    }
    next();
  };
};

export { authenticate, authorize };
