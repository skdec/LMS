import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // Import admin routes
import courseRoutes from "./routes/courseRoutes.js"; // Import admin routes
import studentRoute from "./routes/studentRoutes.js"; // Import admin routes
import invoiceRoutes from "./routes/invoiceRoutes.js"; // Import invoice routes
import { initializeAdmin } from "./controllers/authController.js";
import connectDB from "./config/db.js";

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

app.use(
  express.json({
    limit: "1mb", // ya "2mb", jitna chahiye
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 2) URL-encoded parser bhi limit badhao (agar use kar rahe ho)

// Connect to database
connectDB();

// Initialize default admin
initializeAdmin();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow PUT and other methods
    credentials: true, // If you're using cookies or auth headers
  })
);

// Routes
app.use(authRoutes);
app.use(adminRoutes); // Use admin routes
app.use(courseRoutes); // course routes
app.use(studentRoute);
app.use("/invoice", invoiceRoutes); // invoice routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
