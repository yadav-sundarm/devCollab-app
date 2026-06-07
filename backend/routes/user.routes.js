import express from "express";
import {
  getUserById,
  updateUser,
  changePassword,
  deleteUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch("/update", authMiddleware, updateUser);
router.patch("/changePassword", authMiddleware, changePassword);
router.delete("/delete", authMiddleware, deleteUser);
router.get("/:userId", authMiddleware, getUserById);

export default router;
