import {
  createApplication,
  getApplicationsByProject,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/projects/:projectId/apply", authMiddleware, createApplication);
router.get(
  "/projects/:projectId/applications",
  authMiddleware,
  getApplicationsByProject,
);
router.patch(
  "/projects/:projectId/applications/:applicationId",
  authMiddleware,
  updateApplicationStatus,
);

export default router;
