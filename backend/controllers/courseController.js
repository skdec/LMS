import Course from "../models/Course.js";

// ✅ GET all courses
export const getCourses = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
};

// ✅ GET: Single course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching course", error: error.message });
  }
};

// ✅ POST: Add course
export const addCourse = async (req, res) => {
  try {
    const { title, description, price, category, duration } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required." });
    }

    const newCourse = await Course.create({
      title,
      description,
      price,
      category,
      duration,
    });
    res.status(201).json(newCourse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add course", error: error.message });
  }
};

// ✅ PUT: Update course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

// ✅ DELETE: Remove course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  res.json({ message: "Course deleted successfully" });
};
