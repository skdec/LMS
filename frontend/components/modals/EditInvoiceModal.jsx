"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import Input from "@/components/ui/Input";
import SelectField from "@/components/ui/SelectField";

const EditInvoiceModal = ({ invoice, isOpen, onClose, onInvoiceUpdated }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const courseId = watch("courseId");

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (invoice && isOpen) {
      // Set form values when invoice data is available
      setValue("studentId", invoice.studentId?._id || "");
      setValue("courseId", invoice.courseId?._id || "");
      setValue("finalFees", invoice.finalFees || 0);
    }
  }, [invoice, isOpen, setValue]);

  useEffect(() => {
    const selected = courses.find((c) => c._id === courseId);
    if (selected) {
      setValue("finalFees", selected.price);
    }
  }, [courseId, courses, setValue]);

  const fetchData = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        axiosInstance.get("/get-students"),
        axiosInstance.get("/get-course"),
      ]);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onSubmit = async (data) => {
    if (!invoice) return;

    setLoading(true);
    try {
      await axiosInstance.put(`/invoice/${invoice._id}`, data);
      onInvoiceUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert("Failed to update invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Invoice - {invoice.invoiceNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Current Invoice Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">
            Current Invoice Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">
                Invoice Number:{" "}
                <span className="font-medium">{invoice.invoiceNumber}</span>
              </p>
              <p className="text-gray-600">
                Student:{" "}
                <span className="font-medium">
                  {invoice.studentId?.candidateName}
                </span>
              </p>
              <p className="text-gray-600">
                Course:{" "}
                <span className="font-medium">{invoice.courseId?.title}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                Total Fees:{" "}
                <span className="font-medium">₹{invoice.finalFees}</span>
              </p>
              <p className="text-gray-600">
                Paid Amount:{" "}
                <span className="font-medium">₹{invoice.totalPaid || 0}</span>
              </p>
              <p className="text-gray-600">
                Status: <span className="font-medium">{invoice.status}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Input
            label="Final Fees (Optional Discount)"
            name="finalFees"
            register={register}
            type="number"
            required
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Update Invoice"}
            </button>
          </div>
        </form>

        {/* Warning */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Editing an invoice will update the student,
            course, and fees. Payment history will remain unchanged. Make sure
            to verify all details before updating.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditInvoiceModal;
