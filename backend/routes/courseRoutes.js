import express from "express";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
} from "../controllers/courseController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All routes protected
router.get("/get-course", authMiddleware, getCourses);
router.get("/get-course/:id", authMiddleware, getCourseById); // ✅ Add this route
router.post("/add-course", authMiddleware, addCourse);
router.put("/update-course/:id", authMiddleware, updateCourse);
router.delete("/delete-course/:id", authMiddleware, deleteCourse);

export default router;
