import express from "express";
import {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/add-student", addStudent);
router.get("/get-student", getStudents);
router.put("/update-student/:id", updateStudent);
router.delete("/delete-student/:id", deleteStudent);

export default router;
