"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import {
  LucideUser,
  LucideGraduationCap,
  LucideIdCard,
  LucideFileUpload,
} from "lucide-react";
import Input from "@/components/ui/Input"; // Imported Input component
import FileUploadField from "@/components/ui/FileUploadField";

export default function RegisterStudentPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const selectedCourseId = watch("courseId");

  // Fetch courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoadingCourses(true);
        const res = await axiosInstance.get("/get-course");
        console.log("Courses API response:", res.data);
        if (Array.isArray(res.data)) {
          setCourses(res.data);
          setErrorMessage("");
        } else {
          throw new Error("Invalid course data format");
        }
      } catch (error) {
        console.error(
          "Failed to fetch courses:",
          error.response?.data || error.message
        );
        setErrorMessage(
          `Failed to load courses: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setIsLoadingCourses(false);
      }
    }

    fetchCourses();
  }, []);

  // Auto-populate courseFees and finalFees when course changes
  useEffect(() => {
    if (!selectedCourseId || courses.length === 0) {
      setValue("courseFees", "");
      setValue("finalFees", "");
      return;
    }

    const selected = courses.find((c) => c._id === selectedCourseId);
    if (selected) {
      setValue("nameOfProgramme", selected.title);
      setValue("courseFees", selected.price.toString());
      setValue("finalFees", selected.price.toString());
    }
  }, [selectedCourseId, courses, setValue]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "documents" && value?.length > 0) {
        Array.from(value).forEach((file) => formData.append("documents", file));
      } else if (value) {
        formData.append(key, value);
      }
    });

    try {
      const response = await axiosInstance.post("/students-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Student registered successfully! Redirecting...");
        setIsRedirecting(true);
        setTimeout(() => router.push("/students-data"), 1500);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const sections = [
    {
      title: "Admission Info",
      icon: <LucideGraduationCap />,
      fields: [
        {
          component: Input,
          label: "Admission Date",
          name: "admissionDate",
          type: "date",
          required: true,
        },
      ],
    },
    {
      title: "Personal Information",
      icon: <LucideUser />,
      fields: [
        {
          component: Input,
          label: "Candidate Name",
          name: "candidateName",
          required: true,
        },
        { component: Input, label: "Father Name", name: "fatherName" },
        { component: Input, label: "Mother Name", name: "motherName" },
        {
          component: Input,
          label: "DOB",
          name: "dob",
          type: "date",
          required: true,
        },
        {
          component: SelectField,
          label: "Gender",
          name: "gender",
          options: ["Male", "Female", "Other"],
          required: true,
        },
      ],
    },
    {
      title: "Contact Information",
      icon: <LucideIdCard />,
      fields: [
        { component: Input, label: "Nationality", name: "nationality" },
        { component: Input, label: "Address", name: "permanentAddress" },
        { component: Input, label: "City", name: "city" },
        { component: Input, label: "State", name: "state" },
        { component: Input, label: "Pin Code", name: "pinCode" },
        {
          component: Input,
          label: "Mobile No",
          name: "mobileNo",
          required: true,
          pattern: /^\d{10}$/,
        },
        {
          component: Input,
          label: "Email",
          name: "email",
          required: true,
          pattern: /^\S+@\S+$/i,
        },
      ],
    },
    {
      title: "Program Details",
      icon: <LucideGraduationCap />,
      fields: [
        {
          component: SelectField,
          label: "Program",
          name: "courseId",
          options:
            courses.length > 0
              ? courses.map((c) => ({ value: c._id, label: c.title }))
              : [{ value: "", label: "No courses available" }],
          required: true,
        },
        {
          component: Input,
          label: "Course Fees",
          name: "courseFees",
          readOnly: true,
        },
        {
          component: Input,
          label: "Final Fees",
          name: "finalFees",
          required: true,
        },
      ],
    },
    {
      title: "Additional Information",
      icon: <LucideFileUpload />,
      fields: [
        {
          component: Input,
          label: "Aadhar Number",
          name: "aadharNumber",
          required: true,
          pattern: /^\d{12}$/,
        },
        {
          component: SelectField,
          label: "Category",
          name: "category",
          options: ["General", "OBC", "SC", "ST"],
        },
        { component: Input, label: "Religion", name: "religion" },
        {
          component: SelectField,
          label: "Employed",
          name: "employed",
          options: ["No", "Yes"],
        },
        {
          component: SelectField,
          label: "Status",
          name: "status",
          options: ["active", "disabled"],
        },
        {
          component: FileUploadField,
          label: "Upload Documents",
          name: "documents",
          multiple: true,
          required: true,
          accept: ".pdf,.jpg,.jpeg,.png",
        },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>Register Student</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white p-8 mt-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Register New Student
        </h1>

        {successMessage && (
          <div className="p-4 rounded-lg mb-6 bg-green-100 text-green-800">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 rounded-lg mb-6 bg-red-100 text-red-800">
            {errorMessage}
          </div>
        )}
        {isLoadingCourses && (
          <div className="p-4 rounded-lg mb-6 bg-blue-100 text-blue-800">
            Loading courses...
          </div>
        )}
        {isRedirecting && (
          <div className="p-4 rounded-lg mb-6 bg-blue-100 text-blue-800">
            Redirecting to students data...
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
          encType="multipart/form-data"
        >
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                {section.icon} {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field, idx) => {
                  if (field.component === FileUploadField) {
                    return (
                      <div key={idx} className="md:col-span-2">
                        <FileUploadField
                          label={field.label}
                          error={errors[field.name]}
                          multiple={field.multiple}
                          required={field.required}
                          accept={field.accept}
                          {...register(field.name, {
                            required: field.required
                              ? `${field.label} is required`
                              : false,
                            validate: (files) =>
                              field.required && (!files || files.length === 0)
                                ? "At least one file is required"
                                : true,
                          })}
                        />
                      </div>
                    );
                  }

                  if (field.component === SelectField) {
                    return (
                      <SelectField
                        key={idx}
                        label={field.label}
                        options={field.options}
                        error={errors[field.name]}
                        required={field.required}
                        {...register(field.name, {
                          required: field.required
                            ? `${field.label} is required`
                            : false,
                        })}
                      />
                    );
                  }

                  return (
                    <div key={idx} className="relative">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                      </div>
                      <Input
                        label={field.label}
                        type={field.type}
                        readOnly={field.readOnly}
                        className={`${
                          errors[field.name]
                            ? "border-red-500"
                            : "border-gray-300"
                        } ${
                          field.readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        {...register(field.name, {
                          required: field.required
                            ? `${field.label} is required`
                            : false,
                          pattern: field.pattern
                            ? {
                                value: field.pattern,
                                message: `Invalid ${field.label}`,
                              }
                            : undefined,
                        })}
                      />
                      {errors[field.name] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[field.name].message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingCourses}
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
                isSubmitting || isLoadingCourses
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

// Inline SelectField and FileUploadField (replace with imports if available)
const SelectField = ({ label, options = [], error, required, ...rest }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all text-gray-800 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      {...rest}
    >
      <option value="">Select {label}</option>
      {options.map((opt) =>
        typeof opt === "object" ? (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ) : (
          <option key={opt} value={opt}>
            {opt}
          </option>
        )
      )}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

// const FileUploadField = ({
//   label,
//   error,
//   multiple,
//   required,
//   accept,
//   ...rest
// }) => (
//   <div className="relative">
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div className="flex items-center justify-center w-full">
//       <label className="flex flex-col items-center w-full px-4 py-6 bg-gray-50 text-gray-600 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-100 transition">
//         <FaFileUpload className="text-2xl mb-2" />
//         <span className="text-sm">Click to upload or drag and drop</span>
//         <input
//           type="file"
//           className="hidden"
//           multiple={multiple}
//           accept={accept}
//           {...rest}
//         />
//       </label>
//     </div>
//     {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
//   </div>
// );
