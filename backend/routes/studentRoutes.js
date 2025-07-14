import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  getAllStudents,
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  updateStatus,
  removeDocument,
} from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPEG, or PNG allowed"), false);
    }
  },
});

// Routes
router.get("/get-students", authMiddleware, getAllStudents);
router.get("/students/:id", getStudent);
router.post(
  "/students-upload",
  upload.array("documents", 5),
  authMiddleware,
  addStudent
);
router.put(
  "/students-upload-document/:id",
  upload.array("documents", 5),
  authMiddleware,
  updateStudent
);
router.delete("/students-remove-document/:id", authMiddleware, removeDocument);
router.put("/status/:id", authMiddleware, updateStatus);
router.delete("/students-delete/:id", authMiddleware, deleteStudent);

export default router;
