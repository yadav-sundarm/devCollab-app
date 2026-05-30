import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProjects,
  getProjectsByOwner,
} from "../controllers/project.controller.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", getAllProjects);
router.get("/search", searchProjects);
router.get("/myProjects", authMiddleware, getProjectsByOwner);
router.get("/:projectId", getProjectById);
router.patch("/:projectId", authMiddleware, updateProject);
router.delete("/:projectId", authMiddleware, deleteProject);

export default router;
