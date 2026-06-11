import express from "express";
import { githubAuth, githubCallback } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

export default router;
