import mongoose from "mongoose";

const dietSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true
    },
    food: { type: String, required: true, trim: true }, // e.g., Chicken salad
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, default: 0, min: 0 },      // grams
    carbs: { type: Number, default: 0, min: 0 },
    fat: { type: Number, default: 0, min: 0 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Diet", dietSchema);
