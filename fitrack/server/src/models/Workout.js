import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },      // e.g., Push-ups
    duration: { type: Number, required: true, min: 1 },      // minutes
    calories: { type: Number, default: 0, min: 0 },
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);
