import { fetchGithubData } from "../controllers/github.controller.js";

import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/:userId/userProfile", authMiddleware, fetchGithubData);

export default router;
