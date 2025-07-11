"use client";

import Head from "next/head";
import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import ReusableTable from "@/components/ui/table";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axiosInstance.get("/get-course");
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    }
    fetchCourses();
  }, [courses]);

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/delete-course/${id}`); // Backend route
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete the course. Please try again.");
    }
  };

  const handleUpdate = (id) => {
    alert(`Update course with ID: ${id}`);
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" },
    { key: "category", label: "Category" },
    { key: "duration", label: "Duration" },
  ];

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
        <Head>
          <title>Courses</title>
        </Head>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
            <p className="text-gray-500">
              You have total {courses.length} Courses.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Filtered By</option>
                <option>Status</option>
                <option>Category</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12l-5-5h10l-5 5z" />
                </svg>
              </div>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              + Add Course
            </button>
          </div>
        </div>

        {/* ✅ Reusable Table */}
        <ReusableTable
          columns={columns}
          data={courses}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
