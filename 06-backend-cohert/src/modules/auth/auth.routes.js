import { Router } from "express";
import * as authController from "./auth.controller.js";
import validate from "../../common/middleware/validate.js";
import RegisterDto from "./dto/register.dto.js";

// Create a router instance for authentication endpoints.
const router = Router();

// Register a new user account.
// Validates the request body against RegisterDto before passing it to the controller.
router.post("/register", validate(RegisterDto), authController.register);

// Export the router so it can be mounted in the main application.
export default router;
