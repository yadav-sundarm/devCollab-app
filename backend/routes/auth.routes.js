import {
  signupController,
  loginController,
} from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);

export default router;
