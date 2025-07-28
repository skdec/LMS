"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import {
  FaUser,
  FaGraduationCap,
  FaIdCard,
  FaFileUpload,
} from "react-icons/fa";
import Input from "@/components/ui/Input";
import SelectField from "@/components/ui/SelectField";
import FileUploadField from "@/components/ui/FileUploadField";

export default function RegisterStudentPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [courseFees, setCourseFees] = useState(0);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const selectedCourseId = watch("courseId");

  // Fetch courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoadingCourses(true);
        const res = await axiosInstance.get("/get-course");
        if (res.data && Array.isArray(res.data)) {
          setCourses(res.data);
          setErrorMessage("");
        } else {
          throw new Error("Invalid course data format");
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setErrorMessage("Failed to load courses. Please try again.");
      } finally {
        setIsLoadingCourses(false);
      }
    }

    fetchCourses();
  }, []);

  // Auto-populate courseFees and finalFees when course changes
  useEffect(() => {
    if (!selectedCourseId || courses.length === 0) return;

    const selected = courses.find((c) => c._id === selectedCourseId);
    if (selected) {
      setValue("nameOfProgramme", selected.title);
      setValue("courseFees", selected.price); // ✅ fixed
      setValue("finalFees", selected.price);
      setCourseFees(selected.price);
    }
  }, [selectedCourseId, courses, setValue]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "documents" && value?.length > 0) {
        Array.from(value).forEach((file) => formData.append("documents", file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await axiosInstance.post("/students-upload", formData);

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Student registered successfully! Redirecting...");
        reset();
        setTimeout(() => router.push("/students-data"), 1500);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMessage(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const sections = [
    {
      title: "Personal Information",
      icon: <FaUser />,
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
      icon: <FaIdCard />,
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
      icon: <FaGraduationCap />,
      fields: [
        {
          component: SelectField,
          label: "Program",
          name: "courseId",
          options: courses.map((c) => ({ value: c._id, label: c.title })),
          required: true,
        },
        {
          component: Input,
          label: "Course Fees",
          name: "courseFees",
          readOnly: true,
          value: courseFees,
        },
        { component: Input, label: "Final Fees", name: "finalFees" },
      ],
    },
    {
      title: "Additional Information",
      icon: <FaFileUpload />,
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
                          {...register(field.name, {
                            required: field.required
                              ? `${field.label} is required`
                              : false,
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
                  // Default: Input
                  return (
                    <Input
                      key={idx}
                      label={field.label}
                      type={field.type}
                      readOnly={field.readOnly}
                      defaultValue={field.readOnly ? field.value : undefined}
                      error={errors[field.name]}
                      required={field.required}
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
