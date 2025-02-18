//Package Imports
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

//API imports

//DB import
import connectMongoDB from "./db/mongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT;

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server running on port:${PORT}`);
});
