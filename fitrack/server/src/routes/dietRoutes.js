import { Router } from "express";
import Diet from "../models/Diet.js";

const router = Router();

// READ all diets for current user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "UserId required" });

  try {
    const items = await Diet.find({ userId }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch diets" });
  }
});

// READ one diet (only if belongs to user)
router.get("/:id", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "UserId required" });

  try {
    const item = await Diet.findOne({ _id: req.params.id, userId });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch diet" });
  }
});

// CREATE a diet (must include userId)
router.post("/", async (req, res) => {
  try {
    if (!req.body.userId) return res.status(400).json({ message: "UserId required" });
    const item = await Diet.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
});

// UPDATE a diet (only if belongs to user)
router.put("/:id", async (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ message: "UserId required" });

  try {
    const item = await Diet.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Not found or forbidden" });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
});

// DELETE a diet (only if belongs to user)
router.delete("/:id", async (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ message: "UserId required" });

  try {
    const item = await Diet.findOneAndDelete({ _id: req.params.id, userId });
    if (!item) return res.status(404).json({ message: "Not found or forbidden" });
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Delete failed" });
  }
});

export default router;

