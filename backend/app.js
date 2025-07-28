import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studentRoute from "./routes/studentRoutes.js";
import { initializeAdmin } from "./controllers/authController.js";
import connectDB from "./config/db.js";

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
connectDB();

// Initialize default admin
initializeAdmin();

// Middleware
app.use(express.json({ limit: "10mb" })); // Set reasonable limit for file uploads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Enable if using cookies or auth headers
  })
);

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use(authRoutes);
app.use(adminRoutes);
app.use(courseRoutes);
app.use(studentRoute);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "LMS Backend API is running",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
