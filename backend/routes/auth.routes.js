import {
  signupController,
  loginController,
} from "../controllers/auth.controller.js";
import express from "express";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  message: { message: "Too many attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();
router.post("/signup", authLimiter, signupController);
router.post("/login", authLimiter, loginController);

export default router;
