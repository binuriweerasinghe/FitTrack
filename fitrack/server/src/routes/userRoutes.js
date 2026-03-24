import { Router } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import User from "../models/User.js";

const router = Router();

const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });

router.post("/:id/upload", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Convert buffer to Base64
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype; // e.g., "image/jpeg"
    user.profileImage = `data:${mimeType};base64,${base64Image}`;

    await user.save();
    res.json({ message: "✅ Image uploaded", profileImage: user.profileImage });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ---------- GET user profile by ID ----------
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email age weight height fitnessGoals profileImage"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Bad id" });
  }
});

// ---------- UPDATE user profile ----------
router.put("/:id", async (req, res) => {
  const userId = req.body.userId;
  if (userId !== req.params.id)
    return res.status(403).json({ message: "Forbidden" });

  try {
    const { name, email, age, password, weight, height, fitnessGoals } = req.body;

    const update = {};
    let forceLogout = false;

    if (name !== undefined) update.name = name;

    const userCurrent = await User.findById(req.params.id);
    if (!userCurrent) return res.status(404).json({ message: "User not found" });

    // Check if email is actually changed
    if (email !== undefined && email !== userCurrent.email) {
      update.email = email;
      forceLogout = true;
    }

    if (age !== undefined) update.age = age;
    if (weight !== undefined) update.weight = weight;
    if (height !== undefined) update.height = height;
    if (fitnessGoals !== undefined) update.fitnessGoals = fitnessGoals;

    if (password) {
      update.passwordHash = await bcrypt.hash(password, 10);
      forceLogout = true;
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select("name email age weight height fitnessGoals profileImage");

    res.json({ user, forceLogout });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Update failed" });
  }
});

// ---------- DELETE user ----------
router.delete("/:id", async (req, res) => {
  const userId = req.body.userId;
  if (userId !== req.params.id)
    return res.status(403).json({ message: "Forbidden" });

  try {
    const del = await User.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Delete failed" });
  }
});

// ---------- DELETE Profile Image ----------
router.delete("/:id/profile-image", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.profileImage) {
      return res.status(400).json({ message: "No profile image to delete" });
    }

    // delete file from uploads folder
    const filePath = path.resolve(user.profileImage);
    fs.unlink(filePath, (err) => {
      if (err) console.warn("⚠️ Could not delete file:", err.message);
    });

    user.profileImage = "";
    await user.save();

    res.json({ message: "✅ Profile image deleted" });
  } catch (e) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;









