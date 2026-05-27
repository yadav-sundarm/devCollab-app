import {
  createMessage,
  getMessagesByProject,
  getMessagesByUser,
} from "../controllers/message.controller.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/projects/:projectId/messages", authMiddleware, createMessage);
router.get(
  "/projects/:projectId/messages",
  authMiddleware,
  getMessagesByProject,
);
router.get("/user/messages", authMiddleware, getMessagesByUser);

export default router;
