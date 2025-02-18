//decoding token to see if its valid

import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ message: "UnAuthorized: No token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in verifying token,${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
