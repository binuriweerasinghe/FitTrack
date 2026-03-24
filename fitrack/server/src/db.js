import dotenv from "dotenv";
dotenv.config();  
import mongoose from "mongoose";

console.log("MONGODB_URI from env:", process.env.MONGODB_URI); // 👈 debug

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
