import express from "express";
import {
  login,
  getProfile,
  updatePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/adminPasswordController.js";

const router = express.Router();

// Public routes
router.post("/api/auth/login", login);

// Protected routes
router.get("/api/auth/profile", authMiddleware, getProfile);
router.put("/auth/update-password", authMiddleware, updatePassword);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password/:token", resetPassword);

export default router;
