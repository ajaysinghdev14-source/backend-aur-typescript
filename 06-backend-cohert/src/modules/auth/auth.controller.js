import ApiResponse from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js";

// Handles user registration by delegating to the auth service
// and responding with the newly created user
const register = async (req, res) => {
  const userData = req.body;
  const newUser = await authService.register(userData);
  ApiResponse.success(res, newUser, "User registered successfully");
};

// Handles user login, sets refresh/access tokens as cookies,
// and responds with the logged-in user data
const login = async (req, res) => {
  const loginData = req.body;
  const loggedInUser = await authService.login(loginData);

  // Set refresh token cookie (long-lived, used to issue new access tokens)
  res.cookie("refreshToken", loggedInUser.refreshToken, {
    httpOnly: true, // prevents client-side JS from accessing the cookie (mitigates XSS)
    secure: true, // ensures cookie is only sent over HTTPS
    sameSite: "strict", // recommended: prevents the cookie from being sent on cross-site requests (CSRF protection)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Set access token cookie (short-lived, used for authenticating requests)
  res.cookie("accessToken", loggedInUser.accessToken, {
    httpOnly: true, // prevents client-side JS from accessing the cookie (mitigates XSS)
    secure: true, // ensures cookie is only sent over HTTPS
    sameSite: "strict", // recommended: prevents the cookie from being sent on cross-site requests (CSRF protection)
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  ApiResponse.ok(res, loggedInUser, "User logged in successfully");
};

// Logs the user out by invalidating the server-side session and removing both authentication cookies from the client.
const logout = async (req, res) => {
  // Invalidate the user's refresh token so it cannot be used to create
  // another access token after logout.
  await authService.logout(req.user.id);

  // Remove both cookies from the browser to clear the client's credentials.
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  ApiResponse.ok(res, null, "User logged out successfully");
};

export { register, login, logout };
