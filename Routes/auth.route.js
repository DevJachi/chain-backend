import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../Controllers/auth.controller.js";
import { protect } from "../Middleware/auth.middleware.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login user
router.post("/login", loginUser);

// @route   POST /api/auth/logout
// @desc    Logout user (clear cookie)
router.post("/logout", logoutUser);

// @route   GET /api/auth/me
// @desc    Get current user info (protected route)
router.get("/me", protect, getMe);

export default router;
