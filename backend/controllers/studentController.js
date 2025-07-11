import students from "../models/students";

// ✅ Add student
export const addStudent = async (req, res) => {
  try {
    const newStudent = new students(req.body);
    await newStudent.save();
    res.status(201).json({ message: "Student added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all students
export const getStudents = async (req, res) => {
  const students = await students.find().sort({ createdAt: -1 });
  res.json(students);
};

// ✅ Update student
export const updateStudent = async (req, res) => {
  try {
    await students.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete student
export const deleteStudent = async (req, res) => {
  try {
    await students.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
