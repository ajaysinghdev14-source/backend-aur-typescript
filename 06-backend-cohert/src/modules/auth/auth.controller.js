import ApiResponse from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js";

const register = async (req, res) => {
  // something
  const userData = req.body;
  const newUser = await authService.register(userData);
  ApiResponse.success(res, newUser, "User registered successfully");
};

export { register };
