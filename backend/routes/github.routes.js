import { fetchGithubData } from "../controllers/github.controller.js";

import express from "express";

const router = express.Router();

router.get("/:userId/userProfile", fetchGithubData);

export default router;
