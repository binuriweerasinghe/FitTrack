// src/routes/authRoutes.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = Router();

// -------- REGISTER --------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, weight, height, fitnessGoals } = req.body;

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      age: age ?? null,
      weight: weight ?? null,
      height: height ?? null,
      fitnessGoals: fitnessGoals || "",
    });

    // Return minimal info
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
});

// -------- LOGIN --------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Invalid email or password" });

    // Return user info
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Login failed" });
  }
});

export default router;



