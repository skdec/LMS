import mongoose from "mongoose";

const adminProfileSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  mobileNumber: String,
  gender: String,
  id: String,
  taxId: String,
  taxCountry: String,
  address: String,
  avatar: {
    data: Buffer,
    contentType: String,
  },
  resetToken: { type: String }, // ✅ added
  resetTokenExpiry: { type: Date }, // ✅ added
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("AdminProfile", adminProfileSchema);
