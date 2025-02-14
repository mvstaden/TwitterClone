//Package Imports
import express from "express";
import "dotenv/config";
import cors from "cors";

//API imports
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
const port = 1000;

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
