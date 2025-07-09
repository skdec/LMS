// routes/adminRoutes.js
import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { getAdminProfile } from "../controllers/getAdminProfile.js";
import { updateAdminProfile } from "../controllers/updateAdminProfile.js";
import { upload } from "../middleware/multerMiddleware.js";
import { uploadAdminAvatar } from "../controllers/uploadAdminAvatar.js";

const router = express.Router();

router.get("/admin/profile", authMiddleware, getAdminProfile);
router.put("/admin/profile", authMiddleware, updateAdminProfile);
router.post(
  "/admin/avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAdminAvatar
);

export default router;
