"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import ReusableTable from "@/components/ui/table";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch Students
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await axiosInstance.get("/get-students");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // ✅ View Student Page
  const handleView = (student) => {
    router.push(`/students-data/${student._id}`);
  };

  // ✅ Delete Student
  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this student?")) return;
    try {
      await axiosInstance.delete(`/students-delete/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete student");
    }
  };

  // ✅ Toggle Status
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
      alert("Failed to toggle status");
    }
  };

  // ✅ Table Columns
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
        <div className="flex justify-center items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={student.status === "active"}
              onChange={() => handleStatusToggle(student)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-500 peer-checked:bg-green-500 after:content-[''] after:absolute after:left-[4px] after:top-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <DashboardLayout>
      <Head>
        <title>Students</title>
      </Head>

      <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Students</h1>
            <p className="text-gray-500">Total {students.length} students.</p>
          </div>
        </div>

        <ReusableTable
          columns={columns}
          data={students}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
