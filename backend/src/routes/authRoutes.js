import express from "express";

const router = express.Router();

router.post("/signup", (req, res) => {
  res.status(200).json({ message: "API GET is running" });
});

router.post("/login", (req, res) => {
  res.json({ data: "You hit login endpoint" });
});

router.post("/logout", (req, res) => {
  res.json({ data: "You hit the logout endpoint" });
});

export default router;
