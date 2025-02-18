import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  followUnfollowUser,
  getUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", verifyToken, getUserProfile);
// router.get("/suggested", verifyToken, getSuggestedUsers);
router.post("/follow/:id", verifyToken, followUnfollowUser);
// router.post("/update", verifyToken, updateUserProfile);

export default router;
