import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    age: { type: Number, default: null },
    weight: { type: Number, default: null },
    height: { type: Number, default: null },
    fitnessGoals: { type: String, default: "" },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

