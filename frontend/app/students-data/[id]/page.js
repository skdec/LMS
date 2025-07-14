"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import DashboardLayout from "@/components/layout/DashboardLayout";

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
    { key: "nameOfProgramme", label: "Program Name" },
    { key: "aadharNumber", label: "Aadhar Number" },
    { key: "category", label: "Category" },
    { key: "religion", label: "Religion" },
    { key: "employed", label: "Employment Status" },
    { key: "status", label: "Status", type: "select" },
  ],
};

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await axiosInstance.get(`/students/${id}`);
        setStudent(res.data);
      } catch (err) {
        setError("Failed to fetch student data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

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

  const handleRemoveDocument = async (fullPath) => {
    const filename = fullPath.split(/[\\/\\]/).pop(); // split on both / and \

    try {
      await axiosInstance.delete(
        `/students-remove-document/${id}`,
        {
          data: { filename },
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      console.error("Failed to remove document but proceeding with UI update:", err);
    } finally {
      // Always update the UI
      setStudent((prev) => ({
        ...prev,
        documents: prev.documents.filter((doc) => !doc.includes(filename)),
      }));
    }
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    setIsModalOpen(true);
  };

  const confirmUpdate = async () => {
    try {
      const formData = new FormData();
      Object.entries(student).forEach(([key, value]) => {
        if (key !== "documents") formData.append(key, value || "");
      });

      newFiles.forEach((file) => {
        formData.append("documents", file);
      });

      await axiosInstance.put(`/students-upload-document/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsModalOpen(false);
      setIsEditing(false);
      router.push("/students-data");
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update student. Please try again.");
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

  if (!student) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto text-red-600">
          Student not found
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {isEditing ? "Update Student Profile" : "Student Profile"}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {Object.entries(fieldGroups).map(([groupName, fields]) => (
          <div
            key={groupName}
            className="mb-8 bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {groupName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(({ key, label, type }) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    {label}
                  </label>
                  {isEditing ? (
                    type === "date" ? (
                      <input
                        type="date"
                        value={student[key] || ""}
                        onChange={(e) =>
                          setStudent((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className={`w-full border rounded-lg px-4 py-2 ${
                          formErrors[key] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    ) : type === "select" ? (
                      <select
                        value={student.status}
                        onChange={(e) =>
                          setStudent((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className={`w-full border rounded-lg px-4 py-2 ${
                          formErrors[key] ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={student[key] || ""}
                        onChange={(e) =>
                          setStudent((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className={`w-full border rounded-lg px-4 py-2 ${
                          formErrors[key] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    )
                  ) : (
                    <p className="text-gray-800">{student[key] || "N/A"}</p>
                  )}
                  {formErrors[key] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {isEditing && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upload More Documents
            </h2>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className={`w-full border rounded-lg px-4 py-2 ${
                formErrors.document ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.document && (
              <p className="text-red-500 text-sm mt-1">{formErrors.document}</p>
            )}
          </div>
        )}

        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Documents
          </h2>
          <div className="space-y-2">
            {student.documents?.length > 0 ? (
              student.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4"
                >
                  <a
                    href={`http://localhost:3001/${doc.replace(/\\/g, "/")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {doc.split(/[/\\]/).pop()}
                  </a>
                  <button
                    onClick={() => handleRemoveDocument(doc)}
                    className="text-red-600 hover:text-red-800 text-lg"
                  >
                    ❌
                  </button>
                </div>
              ))
            ) : (
              <p>No documents uploaded</p>
            )}
          </div>
        </div>

        <button
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
        >
          {isEditing ? "Update" : "Edit"}
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Update</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to update this student?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={confirmUpdate}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
