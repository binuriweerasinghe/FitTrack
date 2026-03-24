// Load environment variables (.env file)
import "dotenv/config";

// Import required libraries
import express from "express";
import cors from "cors";
import morgan from "morgan";

// Connect to MongoDB
import "./db.js";

// Import routes
import workoutRoutes from "./routes/workoutRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Create Express app
const app = express();

// -------- Middlewares --------
app.use(cors());             // allow frontend requests
app.use(express.json());     // parse incoming JSON
app.use(morgan("dev"));      // log HTTP requests

// -------- Routes --------
// Default API route
app.get("/", (_req, res) => res.send("API running ✅"));

// Workout routes
app.use("/api/workouts", workoutRoutes);

// Diet routes
app.use("/api/diets", dietRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));



// -------- Error handling --------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

// -------- Start Server --------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

