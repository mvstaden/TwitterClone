import express from "express";
import {
  getAuthenticatedUser,
  login,
  logout,
  signup,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/validateToken", verifyToken, getAuthenticatedUser);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
