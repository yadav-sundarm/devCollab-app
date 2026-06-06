import express from "express";
import { getUserById } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:userId", authMiddleware, getUserById);

export default router;
