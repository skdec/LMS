// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    srNo: { type: Number, unique: true },
    nameOfProgramme: { type: String, required: true },
    candidateName: { type: String, required: true },
    fatherName: String,
    motherName: String,
    dob: { type: String, required: true },
    permanentAddress: String,
    city: String,
    pinCode: String,
    state: String,
    mobileNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    aadharNumber: { type: String, required: true, unique: true },
    category: String,
    gender: { type: String, required: true },
    religion: String,
    nationality: String,
    employed: { type: String, default: "No" },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    documents: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
