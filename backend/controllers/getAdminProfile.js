// controllers/getAdminProfile.js
import AdminProfile from "../models/AdminProfile.js";

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin?.id;

    if (!adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No admin ID found" });
    }

    const profile = await AdminProfile.findOne({ adminId });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    let avatarBase64 = null;
    if (profile.avatar?.data && profile.avatar?.contentType) {
      avatarBase64 = `data:${
        profile.avatar.contentType
      };base64,${profile.avatar.data.toString("base64")}`;
    }

    const profileObj = profile.toObject();
    delete profileObj.avatar;

    res.status(200).json({
      success: true,
      profile: {
        ...profileObj,
        avatar: avatarBase64,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
