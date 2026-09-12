import { Router } from "express";
import * as authController from "./auth.controller.js";
import validate from "../../common/middleware/validate.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
import { authenticate } from "./auth.middlewares.js";

// Create a router instance for authentication endpoints.
const router = Router();

// Register a new user account.
// Validates the request body against RegisterDto before passing it to the controller.
router.post("/register", validate(RegisterDto), authController.register);

// Login an existing user and issue an access token.
// Validates the request body against LoginDto before passing it to the controller.
router.post("/login", validate(LoginDto), authController.login);

// Retrieve the authenticated user's profile information.
router.get("/me", authenticate, authController.getMe);

// Export the router so it can be mounted in the main application.
export default router;
