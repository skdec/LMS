import mongoose from "mongoose";

// Counter schema for srNo auto-increment
const counterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Main student schema
const studentSchema = new mongoose.Schema(
  {
    srNo: {
      type: Number,
      unique: true,
    },
    nameOfProgramme: {
      type: String,
      required: true,
    },
    candidateName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
    },
    motherName: {
      type: String,
    },
    dob: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    state: {
      type: String,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
    },
    nationality: {
      type: String,
    },
    employed: {
      type: String,
      default: "No",
    },
  },
  { timestamps: true }
);

// Auto-increment srNo logic
studentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "student_srNo" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.srNo = counter.seq;
  }
  next();
});

export default mongoose.model("Student", studentSchema);
