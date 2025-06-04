import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import generateToken from "../config/token.js";

// signup
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    //  hashed password
    const hashedPassword = await bcrypt.hash(password, 10);


    // creating new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //  generate token
    const token = await generateToken(user._id);

    //  pass token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      sameSite: "strict",
      secure: false, 
    });
    return res.status(201).json({message: "User signup successfully", user});
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Signup error`, error: error.message });
  }
};

//  Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = await generateToken(user._id);

    // Set token in cookie (httpOnly)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
      secure: false, // set to true if HTTPS in production
    });
    return res
      .status(200)
      .json({ message: "Login successful", user});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login error", error: error.message });
  }
};

//  logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Logout error", error: error.message });
  }
};
