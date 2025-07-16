import Student from "../models/students.js";
import { Counter } from "../models/Counter.js";
import fs from "fs/promises"; // Use promises for cleaner async handling
import mongoose from "mongoose";

// ✅ ADD Student
export const addStudent = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "student_srNo" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const filePaths = req.files?.map((file) => file.path) || [];

    const newStudent = new Student({
      ...req.body,
      srNo: counter.seq,
      documents: filePaths,
    });

    const saved = await newStudent.save();
    res
      .status(201)
      .json({ message: "Student added successfully", data: saved });
  } catch (err) {
    console.error("Add Student Error:", err);
    res
      .status(500)
      .json({ message: "Failed to add student", error: err.message });
  }
};

// ✅ UPDATE Student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Log the incoming data for debugging
    console.log("Update Student req.body:", req.body);

    // Validate required fields
    const requiredFields = [
      "candidateName",
      "nameOfProgramme",
      "dob",
      "mobileNo",
      "email",
      "aadharNumber",
      "gender",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ message: `Missing required field: ${field}` });
      }
    }

    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const filePaths = req.files?.map((file) => file.path) || [];
    const updatedDocuments = [
      ...(existingStudent.documents || []),
      ...filePaths,
    ];

    const updated = await Student.findByIdAndUpdate(
      id,
      {
        ...req.body,
        documents: updatedDocuments,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Student updated successfully", data: updated });
  } catch (err) {
    console.error("Error in updateStudent:", err);
    res
      .status(500)
      .json({ message: "Failed to update student", error: err.message });
  }
};

// ✅ REMOVE Specific Document
export const removeDocument = async (req, res) => {
  const { id } = req.params;
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ message: "Filename is required" });
  }

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const fileToDelete = student.documents.find((doc) =>
      doc.includes(filename)
    );

    if (!fileToDelete) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete from filesystem
    try {
      await fs.unlink(fileToDelete);
    } catch (err) {
      if (err.code !== "ENOENT") {
        // It's okay if the file doesn't exist, maybe it was already deleted
        console.error("❌ Error deleting file:", err);
        // Decide if you want to stop or continue
        // return res.status(500).json({ message: "Error deleting file" });
      }
    }

    // Filter document list and update in DB atomically
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { documents: student.documents.filter((doc) => !doc.includes(filename)) },
      { new: true }
    );

    res.status(200).json({
      message: "File removed successfully",
      documents: updatedStudent.documents,
    });
  } catch (err) {
    console.error("❌ Error removing document:", err);
    res.status(500).json({ message: "Failed to remove document" });
  }
};

// ✅ GET All Students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (err) {
    console.error("Error in getAllStudents:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: err.message });
  }
};

// ✅ GET One Student
export const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error("Error in getStudent:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch student", error: err.message });
  }
};

// ✅ DELETE Student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete associated files
    if (student.documents && student.documents.length > 0) {
      for (const filePath of student.documents) {
        try {
          await fs.unlink(filePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.error(`Failed to delete file ${filePath}:`, err);
          }
        }
      }
    }

    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error in deleteStudent:", err);
    res
      .status(500)
      .json({ message: "Failed to delete student", error: err.message });
  }
};

// ✅ UPDATE Student Status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    if (!["active", "disabled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res
      .status(200)
      .json({ message: "Status updated successfully", data: updated });
  } catch (err) {
    console.error("Error in updateStatus:", err);
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};
