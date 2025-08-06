"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Input from "@/components/ui/Input";
import SelectField from "@/components/ui/SelectField";
import { useRouter } from "next/navigation";

const CreateInvoicePage = () => {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axiosInstance.get("/get-students").then((res) => setStudents(res.data));
    axiosInstance.get("/get-course").then((res) => setCourses(res.data));
  }, []);

  const courseId = watch("courseId");

  useEffect(() => {
    const selected = courses.find((c) => c._id === courseId);
    if (selected) setValue("finalFees", selected.price);
  }, [courseId, courses, setValue]);

  const onSubmit = async (data) => {
    await axiosInstance.post("/invoice/create", data);
    router.push("/invoice");
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        {/* Student Dropdown */}
        <SelectField
          label="Student"
          name="studentId"
          register={register}
          required
          options={students.map((s) => ({
            value: s._id,
            label: s.candidateName,
          }))}
        />

        {/* Course Dropdown */}
        <SelectField
          label="Course"
          name="courseId"
          register={register}
          required
          options={courses.map((c) => ({
            value: c._id,
            label: c.title,
          }))}
        />

        {/* Final Fees Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Final Fees (Optional Discount)
          </label>
          <Input name="finalFees" register={register} type="number" />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Invoice
        </button>
      </form>
    </DashboardLayout>
  );
};

export default CreateInvoicePage;
