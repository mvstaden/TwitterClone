import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createPost } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
// router.post("/like/:id", verifyToken, likeUnlikePost);
// router.post("/comment/:id", verifyToken, commentOnPost);
// router.delete("/", verifyToken, deletePost);

export default router;
