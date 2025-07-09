// controllers/adminAuthController.js

import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import AdminProfile from "../models/AdminProfile.js";
import sendEmail from "../utils/sendEmail.js";

const FRONTEND_URL = "http://localhost:3000"; // Update to your actual frontend URL

// 🔐 Send Reset Link
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const adminProfile = await AdminProfile.findOne({ email });
  if (!adminProfile) {
    return res.status(404).json({ message: "No admin found with this email" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  adminProfile.resetToken = token;
  adminProfile.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await adminProfile.save();

  const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <h3>Reset Your Password</h3>
    <p>Click below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  await sendEmail(email, "Admin Password Reset", html);
  res.json({ message: "Password reset link sent to your email." });
};

// 🔐 Handle Password Reset
// Reset Password Controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminProfile = await AdminProfile.findOne({ email: decoded.email });

    if (!adminProfile) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const admin = await Admin.findById(adminProfile.adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    // ✅ set and save password so pre-save hook triggers
    admin.password = newPassword;
    await admin.save(); // This will hash the password

    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};
