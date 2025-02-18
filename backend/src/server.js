//Package Imports
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

//API imports
import authRoutes from "./routes/authRoutes.js";
//DB import
import connectMongoDB from "./db/mongoDB.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use(cookieParser());


const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server running on port:${PORT}`);
});
