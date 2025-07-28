"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useProtectedRoute } from "@/utils/useProtectedRoute";
import Input from "@/components/ui/Input";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SelectField from "@/components/ui/SelectField";
import FileUploadField from "@/components/ui/FileUploadField";

const fieldGroups = {
  "Personal Information": [
    { key: "candidateName", label: "Name" },
    { key: "fatherName", label: "Father's Name" },
    { key: "motherName", label: "Mother's Name" },
    { key: "dob", label: "Date of Birth", type: "date" },
    { key: "gender", label: "Gender" },
    { key: "nationality", label: "Nationality" },
  ],
  "Contact Information": [
    { key: "permanentAddress", label: "Permanent Address" },
    { key: "city", label: "City" },
    { key: "pinCode", label: "Pin Code" },
    { key: "state", label: "State" },
    { key: "mobileNo", label: "Mobile Number" },
    { key: "email", label: "Email" },
  ],
  "Additional Details": [
    { key: "nameOfProgramme", label: "Program Name", type: "select" },
    { key: "aadharNumber", label: "Aadhar Number" },
    { key: "category", label: "Category" },
    { key: "religion", label: "Religion" },
    { key: "employed", label: "Employment Status" },
    { key: "status", label: "Status", type: "status" },
  ],
};

export default function StudentProfilePage() {
  useProtectedRoute();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [docToDelete, setDocToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseFees, setCourseFees] = useState("");
  const [finalFees, setFinalFees] = useState("");

  useEffect(() => {
    fetchStudent();
    fetchCourses();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axiosInstance.get(`/students/${id}`);
      setStudent(res.data);
      setCourseFees(res.data.courseFees || "");
      setFinalFees(res.data.finalFees || "");
    } catch {
      setError("Failed to fetch student data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/get-course");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses", err);
    }
  };

  const handleProgrammeChange = async (value) => {
    setStudent({ ...student, nameOfProgramme: value });
    try {
      const res = await axiosInstance.get(`/course-fee/${value}`);
      setCourseFees(res.data.fees);
    } catch {
      setCourseFees("");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!student?.candidateName?.trim())
      errors.candidateName = "Name is required";
    if (!student?.email?.trim() || !/\S+@\S+\.\S+/.test(student.email))
      errors.email = "Valid email is required";
    if (!student?.mobileNo?.trim() || !/^\d{10}$/.test(student.mobileNo))
      errors.mobileNo = "Valid 10-digit mobile number is required";

    newFiles.forEach((file) => {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type))
        errors.document = "Only PDF, JPEG, or PNG files are allowed";
      if (file.size > 3 * 1024 * 1024)
        errors.document = "File size must be less than 3MB";
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  const confirmDeleteDocument = async (fullPath) => {
    try {
      await axiosInstance.delete(`/students-remove-document/${id}`, {
        data: { filename: fullPath },
        headers: { "Content-Type": "application/json" },
      });
      setStudent((prev) => ({
        ...prev,
        documents: prev.documents.filter((doc) => doc !== fullPath),
      }));
    } catch {
      setError("Failed to delete document");
    } finally {
      setDocToDelete(null);
    }
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    setIsModalOpen(true);
  };

  const confirmUpdate = async () => {
    try {
      const formData = new FormData();
      const allowedFields = Object.values(fieldGroups)
        .flat()
        .map((f) => f.key);
      allowedFields.forEach((key) => {
        formData.append(key, student[key] || "");
      });
      formData.append("courseFees", Number(courseFees));
      formData.append("finalFees", Number(finalFees));
      newFiles.forEach((file) => formData.append("documents", file));

      await axiosInstance.put(`/students-upload-document/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("✅ Profile updated successfully!");
      setIsModalOpen(false);
      setIsEditing(false);
      setNewFiles([]);
      fetchStudent();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError("Update failed. Please try again.");
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto relative">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEditing ? "Update Student Profile" : "Student Profile"}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-md z-50">
            {successMessage}
          </div>
        )}

        {Object.entries(fieldGroups).map(([group, fields]) => (
          <div key={group} className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {group}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(({ key, label, type }) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-1">
                    {label}
                  </label>
                  {isEditing ? (
                    type === "date" ? (
                      <Input
                        type="date"
                        value={student[key] || ""}
                        onChange={(e) =>
                          setStudent({ ...student, [key]: e.target.value })
                        }
                        error={formErrors[key]}
                      />
                    ) : type === "select" ? (
                      <SelectField
                        value={student.nameOfProgramme}
                        onChange={(e) => handleProgrammeChange(e.target.value)}
                        options={courses.map((c) => ({
                          value: c.title,
                          label: c.title,
                        }))}
                        error={formErrors[key]}
                        required
                      />
                    ) : type === "status" ? (
                      <SelectField
                        value={student.status}
                        onChange={(e) =>
                          setStudent({ ...student, status: e.target.value })
                        }
                        options={[
                          { value: "active", label: "Active" },
                          { value: "disabled", label: "Disabled" },
                        ]}
                        error={formErrors[key]}
                        required
                      />
                    ) : (
                      <Input
                        type="text"
                        value={student[key] || ""}
                        onChange={(e) =>
                          setStudent({ ...student, [key]: e.target.value })
                        }
                        error={formErrors[key]}
                      />
                    )
                  ) : (
                    <p className="text-gray-900">{student[key] || "N/A"}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Course Fee and Final Fee */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEditing ? (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-1">
                    Course Fee
                  </label>
                  <Input
                    type="text"
                    value={courseFees}
                    readOnly
                    className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-1">
                    Final Fee (Editable)
                  </label>
                  <Input
                    type="text"
                    value={finalFees}
                    onChange={(e) => setFinalFees(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 border-gray-300"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-1">
                    Course Fee
                  </label>
                  <p className="text-gray-900">{student.courseFees || "N/A"}</p>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-1">
                    Final Fee
                  </label>
                  <p className="text-gray-900">{student.finalFees || "N/A"}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Upload Files */}
        {isEditing && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload More Documents
            </h2>
            <div className="md:col-span-2">
              <FileUploadField
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                error={formErrors.document}
                label="Upload Documents"
              />
            </div>
          </div>
        )}

        {/* Uploaded Documents */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Documents
          </h2>
          <div className="space-y-2">
            {student?.documents?.length > 0 ? (
              student.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4"
                >
                  <a
                    href={`http://localhost:3001/${doc.replace(/\\/g, "/")}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {doc.split(/[\\/]/).pop()}
                  </a>
                  <button
                    onClick={() => setDocToDelete(doc)}
                    className="text-red-600 hover:text-red-800 text-lg"
                  >
                    ❌
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-900">No documents uploaded</p>
            )}
          </div>
        </div>

        {/* Delete Modal */}
        <ConfirmModal
          isOpen={!!docToDelete}
          onClose={() => setDocToDelete(null)}
          onConfirm={() => confirmDeleteDocument(docToDelete)}
          title="Delete Document"
          message="Are you sure you want to delete this document?"
        />

        {/* Update Modal */}
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmUpdate}
          title="Update Student"
          message="Are you sure you want to update this student's profile?"
        />

        <button
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
        >
          {isEditing ? "Update" : "Edit"}
        </button>
      </div>
    </DashboardLayout>
  );
}
