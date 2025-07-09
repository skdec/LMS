import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/constants.js";

export const initializeAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: "admin" });
    if (!adminExists) {
      const admin = new Admin({
        username: "admin",
        password: "admin123",
      });
      await admin.save();
      console.log("🔑 Default admin created");
    }
  } catch (err) {
    console.error("❌ Admin initialization error:", err);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: JWT_CONFIG.EXPIRES_IN,
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        username: admin.username,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    res.json({
      success: true,
      admin,
    });
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new passwords are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("❌ Password update error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};
