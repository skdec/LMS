import express from "express";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All routes protected
router.get("/get-course", authMiddleware, getCourses);
router.post("/addcourse", authMiddleware, addCourse);
router.put("/updatecourse/:id", authMiddleware, updateCourse);
router.delete("/delete-course/:id", authMiddleware, deleteCourse);

export default router;
``;
