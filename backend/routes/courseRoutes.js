import express from "express";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  getCourseFeesByName,
  getCourseFeesById, // 🆕 import
} from "../controllers/courseController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-course", authMiddleware, getCourses);
router.get("/get-course/:id", authMiddleware, getCourseById);
router.post("/add-course", authMiddleware, addCourse);
router.put("/update-course/:id", authMiddleware, updateCourse);
router.delete("/delete-course/:id", authMiddleware, deleteCourse);
router.get("/course-fee/:name", authMiddleware, getCourseFeesByName);

// ✅ 🆕 Add this new route
router.get("/course-fee-by-id/:id", authMiddleware, getCourseFeesById);

export default router;
