"use client";

import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import ReusableTable from "@/components/ui/table";
import AddCourseForm from "@/components/CourseForm";
import { useProtectedRoute } from "@/utils/useProtectedRoute";
import Button from "@/components/ui/Button";

export default function Home() {
  useProtectedRoute();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const modalRef = useRef(null);

  // ✅ Fetch courses on mount
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
  }, []);

  // ✅ Delete Handler
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/delete-course/${id}`);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete the course. Please try again.");
    }
  };

  // ✅ Update Handler with fetch
  const handleUpdate = async (id) => {
    try {
      const res = await axiosInstance.get(`/get-course/${id}`);
      setEditCourse(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch course for update:", error);
      alert("Something went wrong while loading course data.");
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" },
    { key: "category", label: "Category" },
    { key: "duration", label: "Duration" },
  ];

  // ✅ Modal close on outside click
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
      setEditCourse(null);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <DashboardLayout>
      <Head>
        <title>Courses</title>
      </Head>

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm pt-10">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 transform transition-all duration-500 translate-y-[-100px] animate-slide-down"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editCourse ? "Update Course" : "Add New Course"}
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowModal(false);
                  setEditCourse(null);
                }}
                className="text-xl font-bold"
              >
                ×
              </Button>
            </div>

            {/* ✅ Pass props to form */}
            <AddCourseForm
              defaultValues={editCourse}
              onClose={() => {
                setShowModal(false);
                setEditCourse(null);
              }}
              onSuccess={(updatedCourse) => {
                if (editCourse) {
                  setCourses((prev) =>
                    prev.map((c) =>
                      c._id === updatedCourse._id ? updatedCourse : c
                    )
                  );
                } else {
                  setCourses((prev) => [updatedCourse, ...prev]);
                }
                setShowModal(false);
                setEditCourse(null);
              }}
            />
          </div>
        </div>
      )}

      {/* ✅ Main Section */}
      <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
            <p className="text-gray-500">
              You have total {courses.length} Courses.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              setEditCourse(null); // add mode
              setShowModal(true);
            }}
          >
            + Add Course
          </Button>
        </div>

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
