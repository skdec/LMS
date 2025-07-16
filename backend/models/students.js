import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    srNo: { type: Number, unique: true },
    nameOfProgramme: { type: String, required: true },
    candidateName: { type: String, required: true },
    fatherName: String,
    motherName: String,
    dob: { type: Date, required: true }, // 👈 Date hona chahiye
    permanentAddress: String,
    city: String,
    pinCode: String,
    state: String,
    mobileNo: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    aadharNumber: { type: String, required: true, unique: true },
    category: String,
    gender: { type: String, required: true },
    religion: String,
    nationality: String,
    employed: { type: String, default: "No" },
    status: { type: String, enum: ["active", "disabled"], default: "active" },

    // ✅ New fields related to course & fees
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Course model ka naam
    },
    courseFees: Number, // fetched automatically on course select
    finalFees: Number, // manually editable

    documents: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
