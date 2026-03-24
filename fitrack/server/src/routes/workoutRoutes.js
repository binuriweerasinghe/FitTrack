import { Router } from "express";
import Workout from "../models/Workout.js";

const router = Router();

// READ all workouts for current user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "UserId required" });
  const items = await Workout.find({ userId }).sort({ date: -1 });
  res.json(items);
});

// READ one workout (only if belongs to user)
router.get("/:id", async (req, res) => {
  const userId = req.query.userId;
  const item = await Workout.findOne({ _id: req.params.id, userId });
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const item = await Workout.create(req.body); // frontend must send userId
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const userId = req.body.userId;
  const item = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: "Not found or forbidden" });
  res.json(item);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const userId = req.body.userId;
  const item = await Workout.findOneAndDelete({ _id: req.params.id, userId });
  if (!item) return res.status(404).json({ message: "Not found or forbidden" });
  res.json({ message: "Deleted" });
});


export default router;
