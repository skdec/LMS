// controllers/uploadAdminAvatar.js
import AdminProfile from "../models/AdminProfile.js";

export const uploadAdminAvatar = async (req, res) => {
  try {
    const adminId = req.admin.id;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const updatedProfile = await AdminProfile.findOneAndUpdate(
      { adminId },
      {
        avatar: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Avatar Upload Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while uploading avatar",
    });
  }
};
