"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import ReusableTable from "@/components/ui/table";
import { useProtectedRoute } from "@/utils/useProtectedRoute";
import Button from "@/components/ui/Button";

export default function StudentsPage() {
  useProtectedRoute();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleAddStudent = () => {
    router.push("/register-student");
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
          <div className="relative w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-green-400 peer-checked:to-green-600 transition-all duration-300 after:content-[''] after:absolute after:left-[4px] after:top-[3px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full after:shadow-md"></div>
        </label>
      ),
    },
  ];

  if (loading)
    return <div className="p-6 text-gray-600 animate-pulse">Loading...</div>;

  return (
    <DashboardLayout>
      <Head>
        <title>Students</title>
      </Head>

      <div className="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Students Management
            </h1>
            <p className="text-gray-500 mt-1">
              Total {students.length} students
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={handleAddStudent}>
            Add Student
          </Button>
        </div>

        {successMessage && (
          <div className="mb-6 px-6 py-4 bg-green-100 text-green-800 rounded-lg shadow-md animate-slide-in">
            ✅ {successMessage}
          </div>
        )}

        <ReusableTable
          data={students}
          columns={columns}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
