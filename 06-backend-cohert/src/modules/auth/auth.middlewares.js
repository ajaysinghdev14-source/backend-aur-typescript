import ApiError from "../../common/utils/api-error.js";
import User from "./auth.model.js";
import { verifyAccessToken } from "./auth.utils.js";

// Middleware to validate the bearer token and attach the authenticated user to the request.
const authenticate = async (req, res, next) => {
  let token;

  // Extract the JWT from the Authorization header if it follows the Bearer format.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Reject requests that do not include an access token.
  if (!token) {
    throw ApiError.unauthorized("Authentication token is required");
  }

  // Verify the token and decode its payload.
  const decoded = verifyAccessToken(token);

  // Fetch the user associated with the token subject.
  const user = await User.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized("User not found");
  }

  // Attach the authenticated user information to the request for downstream use.
  req.user = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  next();
};

// Middleware factory to restrict access to users with one of the allowed roles.
const authorize = (...roles) => {
  return (req, res, next) => {
    // Deny access when the current user's role is not permitted.
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        "You are not authorized to access this resource",
      );
    }

    next();
  };
};

export { authenticate, authorize };
