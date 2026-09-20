import express from "express";
import { registerUser, loginUser, getMe, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validationMiddleware.js";
import { registerSchema, loginSchema } from "../middleware/schemas.js";

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", authLimiter, validate(loginSchema), loginUser);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);

export default router;
