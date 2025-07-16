"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import ReusableTable from "@/components/ui/table";
import { useProtectedRoute } from "@/utils/useProtectedRoute";
import { useCookies } from "react-cookie";

export default function StudentsPage() {
  useProtectedRoute();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cookies, setCookie] = useCookies(["addStudentForm"]);

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [step, setStep] = useState(1);

  const [addForm, setAddForm] = useState({
    candidateName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    nationality: "",
    permanentAddress: "",
    city: "",
    pinCode: "",
    state: "",
    mobileNo: "",
    email: "",
    nameOfProgramme: "",
    aadharNumber: "",
    category: "",
    religion: "",
    employed: "No",
    status: "active",
    courseId: "",
    courseFees: 0,
    finalFees: 0,
    documents: [],
  });

  // Prefill from cookies
  useEffect(() => {
    if (cookies.addStudentForm) setAddForm(cookies.addStudentForm);
  }, []);

  useEffect(() => {
    setCookie("addStudentForm", addForm, { path: "/" });
  }, [addForm]);

  useEffect(() => {
    async function fetchCourses() {
      const res = await axiosInstance.get("/get-course");
      setCourses(res.data);
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) {
      setSuccessMessage(msg);
      const timer = setTimeout(() => {
        setSuccessMessage("");
        const url = new URL(window.location.href);
        url.searchParams.delete("message");
        window.history.replaceState({}, "", url);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await axiosInstance.get("/get-students");
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const handleStatusToggle = async (student) => {
    const newStatus = student.status === "active" ? "disabled" : "active";
    try {
      await axiosInstance.put(`/status/${student._id}`, { status: newStatus });
      setStudents((prev) =>
        prev.map((s) =>
          s._id === student._id ? { ...s, status: newStatus } : s
        )
      );
    } catch {
      alert("Status update failed");
    }
  };

  const handleView = (student) => {
    router.push(`/students-data/${student._id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await axiosInstance.delete(`/students-delete/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete student");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));

    if (name === "nameOfProgramme") {
      const selected = courses.find((c) => c.title === value);
      if (selected) {
        setAddForm((prev) => ({
          ...prev,
          courseId: selected._id,
          courseFees: selected.fees,
          finalFees: selected.fees,
        }));
      }
    }
  };

  const validateCurrentStep = () => {
    const errors = {};
    if (step === 1) {
      if (!addForm.candidateName.trim())
        errors.candidateName = "Name is required";
      if (!addForm.dob) errors.dob = "DOB is required";
      if (!addForm.gender) errors.gender = "Gender is required";
    } else if (step === 2) {
      if (!/^\d{10}$/.test(addForm.mobileNo))
        errors.mobileNo = "Valid 10-digit mobile required";
      if (!/\S+@\S+\.\S+/.test(addForm.email))
        errors.email = "Valid email required";
    } else if (step === 3) {
      if (!addForm.nameOfProgramme)
        errors.nameOfProgramme = "Program is required";
    } else if (step === 4) {
      if (!/^\d{12}$/.test(addForm.aadharNumber))
        errors.aadharNumber = "12-digit Aadhar required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    try {
      await axiosInstance.post("/students-upload", addForm);
      setIsAddModalOpen(false);
      setSuccessMessage("Student added successfully");
      setAddForm({
        candidateName: "",
        fatherName: "",
        motherName: "",
        dob: "",
        gender: "",
        nationality: "",
        permanentAddress: "",
        city: "",
        pinCode: "",
        state: "",
        mobileNo: "",
        email: "",
        nameOfProgramme: "",
        aadharNumber: "",
        category: "",
        religion: "",
        employed: "No",
        status: "active",
        courseId: "",
        courseFees: 0,
        finalFees: 0,
        documents: [],
      });
      setCookie("addStudentForm", {}, { path: "/" });

      const res = await axiosInstance.get("/get-students");
      setStudents(res.data);
    } catch {
      setFormErrors({ submit: "Failed to submit form. Try again." });
    }
  };

  const columns = [
    { key: "srNo", label: "Sr No" },
    { key: "candidateName", label: "Name" },
    { key: "mobileNo", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "gender", label: "Gender" },
    { key: "aadharNumber", label: "Aadhar" },
    { key: "nameOfProgramme", label: "Programme" },
    {
      key: "status",
      label: "Status",
      render: (student) => (
        <label className="inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={student.status === "active"}
            onChange={() => handleStatusToggle(student)}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 after:content-[''] after:absolute after:left-[4px] after:top-[3px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      ),
    },
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <DashboardLayout>
      <Head>
        <title>Students</title>
      </Head>

      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Students Management
            </h1>
            <p className="text-gray-500">Total {students.length} students</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Add New Student
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 px-4 py-3 bg-green-100 text-green-700 rounded">
            ✅ {successMessage}
          </div>
        )}

        <ReusableTable
          data={students}
          columns={columns}
          onView={handleView}
          onDelete={handleDelete}
        />

        {/* Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Add Student - Step {step}/4
              </h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                {step === 1 && (
                  <>
                    <InputField
                      label="Name"
                      name="candidateName"
                      value={addForm.candidateName}
                      onChange={handleChange}
                      error={formErrors.candidateName}
                      required
                    />
                    <InputField
                      label="Father's Name"
                      name="fatherName"
                      value={addForm.fatherName}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Mother's Name"
                      name="motherName"
                      value={addForm.motherName}
                      onChange={handleChange}
                    />
                    <InputField
                      type="date"
                      label="DOB"
                      name="dob"
                      value={addForm.dob}
                      onChange={handleChange}
                      error={formErrors.dob}
                      required
                    />
                    <SelectField
                      label="Gender"
                      name="gender"
                      value={addForm.gender}
                      onChange={handleChange}
                      options={["Male", "Female", "Other"]}
                      error={formErrors.gender}
                      required
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    <InputField
                      label="Mobile No"
                      name="mobileNo"
                      value={addForm.mobileNo}
                      onChange={handleChange}
                      error={formErrors.mobileNo}
                      required
                    />
                    <InputField
                      label="Email"
                      name="email"
                      value={addForm.email}
                      onChange={handleChange}
                      error={formErrors.email}
                      required
                    />
                    <InputField
                      label="Address"
                      name="permanentAddress"
                      value={addForm.permanentAddress}
                      onChange={handleChange}
                    />
                    <InputField
                      label="City"
                      name="city"
                      value={addForm.city}
                      onChange={handleChange}
                    />
                    <InputField
                      label="State"
                      name="state"
                      value={addForm.state}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Pin Code"
                      name="pinCode"
                      value={addForm.pinCode}
                      onChange={handleChange}
                    />
                  </>
                )}
                {step === 3 && (
                  <>
                    <SelectField
                      label="Program"
                      name="nameOfProgramme"
                      value={addForm.nameOfProgramme}
                      onChange={handleChange}
                      options={courses.map((c) => c.title)}
                      error={formErrors.nameOfProgramme}
                      required
                    />
                    <InputField
                      label="Course Fees"
                      name="courseFees"
                      value={addForm.courseFees}
                      readOnly
                    />
                    <InputField
                      label="Final Fees"
                      name="finalFees"
                      value={addForm.finalFees}
                      onChange={handleChange}
                    />
                  </>
                )}
                {step === 4 && (
                  <>
                    <InputField
                      label="Aadhar Number"
                      name="aadharNumber"
                      value={addForm.aadharNumber}
                      onChange={handleChange}
                      error={formErrors.aadharNumber}
                      required
                    />
                    <SelectField
                      label="Category"
                      name="category"
                      value={addForm.category}
                      onChange={handleChange}
                      options={["General", "OBC", "SC", "ST"]}
                    />
                    <InputField
                      label="Religion"
                      name="religion"
                      value={addForm.religion}
                      onChange={handleChange}
                    />
                    <SelectField
                      label="Employed"
                      name="employed"
                      value={addForm.employed}
                      onChange={handleChange}
                      options={["No", "Yes"]}
                    />
                  </>
                )}

                {formErrors.submit && (
                  <p className="text-red-500">{formErrors.submit}</p>
                )}

                <div className="flex justify-between mt-6">
                  {step > 1 && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </button>
                  )}
                  {step < 4 ? (
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                      onClick={() => validateCurrentStep() && setStep(step + 1)}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Reusable Input Field
function InputField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  ...props
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Reusable Select Field
function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
