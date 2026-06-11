import express from "express";
import {
  getUserById,
  updateUser,
  deleteUser,
  completeProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch("/update", authMiddleware, updateUser);
router.delete("/delete", authMiddleware, deleteUser);
router.patch("/complete-profile", authMiddleware, completeProfile);
router.get("/:userId", authMiddleware, getUserById);

export default router;
