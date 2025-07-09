// controllers/updateAdminProfile.js
import AdminProfile from "../models/AdminProfile.js";

export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 1) Extract fields that can be updated
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      gender,
      id,
      taxId,
      taxCountry,
      address,
    } = req.body;

    // 2) Find the profile
    const profile = await AdminProfile.findOne({ adminId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // 3) Check if the new email is already in use by another profile
    if (email !== undefined && email !== profile.email) {
      const existingProfile = await AdminProfile.findOne({
        email,
        adminId: { $ne: adminId }, // Exclude the current profile
      });
      if (existingProfile) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another profile",
        });
      }
    }

    // 4) Assign new values to the profile
    if (firstName !== undefined) profile.firstName = firstName;
    if (lastName !== undefined) profile.lastName = lastName;
    if (email !== undefined) profile.email = email;
    if (mobileNumber !== undefined) profile.mobileNumber = mobileNumber;
    if (gender !== undefined) profile.gender = gender;
    if (id !== undefined) profile.id = id;
    if (taxId !== undefined) profile.taxId = taxId;
    if (taxCountry !== undefined) profile.taxCountry = taxCountry;
    if (address !== undefined) profile.address = address;

    profile.updatedAt = Date.now();

    // 5) Save the updated profile
    const updated = await profile.save();
    res.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Profile update failed:", error);
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another profile",
      });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};
