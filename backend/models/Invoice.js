// models/Invoice.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amountPaid: Number,
  mode: String, // e.g., Cash, UPI, Card
});

const invoiceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    courseFees: Number, // original price from Course.price
    finalFees: Number, // editable
    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Partially Paid"],
      default: "Unpaid",
    },
    paymentHistory: [paymentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
