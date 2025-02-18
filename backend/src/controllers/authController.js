import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password needs to be atleast 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res
        .status(200)
        .json({ message: "User successfully added", data: newUser });
    }
  } catch (error) {
    console.log(`Error adding new user:${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    //Compare password
    const isPassword = await bcrypt.compare(password, user.password);
    if (!user || !isPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({ message: "Login successfull", data: user });
  } catch (error) {
    console.log(`Error logging in:${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("auth_token", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(`Error logging out:${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAuthenticatedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ user: user._id });
  } catch (error) {
    console.log(`Error authenticating user out:${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
