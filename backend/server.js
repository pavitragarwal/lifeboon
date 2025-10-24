// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lifeboon";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Import routes
import hospitalRoutes from "./routes/hospitalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

// Use routes
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => res.send("LifeBoon API is running"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API endpoints:`);
  console.log(`   - Hospitals: http://localhost:${PORT}/api/hospitals`);
  console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
  console.log(`   - Appointments: http://localhost:${PORT}/api/appointments`);
});