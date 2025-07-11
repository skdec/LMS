import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Book, Clock, Tag, Text } from "lucide-react";
import Input from "@/components/ui/Input";
import axiosInstance from "@/utils/axiosInstance";

// Rupee Icon (custom)
const RupeeIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12M6 8h12M8.5 13H12a3 3 0 0 0 0-6H8.83a2.5 2.5 0 0 0-2.5 2.5v1.67a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 0 0 5h6.67a2.5 2.5 0 0 0 2.5-2.5V15" />
  </svg>
);

// Select Component
const Select = ({
  label,
  id,
  register,
  errors,
  options,
  icon: Icon,
  required,
}) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <span className="absolute inset-y-0 left-2 flex items-center text-gray-500">
          <Icon size={16} />
        </span>
      )}
      <select
        id={id}
        {...register(id)}
        className={`w-full border px-3 py-2 rounded-md text-gray-900 ${
          Icon ? "pl-8" : ""
        } ${errors[id] ? "border-red-500" : "border-gray-300"}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    {errors[id] && (
      <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>
    )}
  </div>
);

// Category Options
const categoryOptions = [
  { value: "Software & web-development", label: "Web Development" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Cyber Security", label: "Cyber Security" },
  { value: "UI UX Design", label: "UI UX Design" },
];

const AddCourseForm = ({ defaultValues, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues); // for update mode
    } else {
      reset(); // for add mode
    }
  }, [defaultValues]);

  const onSubmit = async (data) => {
    try {
      let response;

      if (defaultValues?._id) {
        // ✅ Update Mode
        response = await axiosInstance.put(
          `/update-course/${defaultValues._id}`,
          data
        );
      } else {
        // ✅ Add Mode
        response = await axiosInstance.post("/add-course", {
          ...data,
          id: uuidv4(), // optional
        });
      }

      onSuccess(response.data); // pass updated/created course
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {defaultValues ? "Update Course" : "Add New Course"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
        <Input
          label="Title"
          id="title"
          icon={Book}
          placeholder="Enter course title"
          {...register("title", {
            required: "Title is required",
          })}
          className={errors.title ? "border-red-500" : "border-gray-300"}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}

        {/* Description */}
        <Input
          label="Description"
          id="description"
          icon={Text}
          as="textarea"
          placeholder="Enter course description"
          {...register("description")}
          className="h-32 resize-y border-gray-300"
        />

        {/* Price Field */}
        <Input
          label="Price (₹)"
          id="price"
          icon={RupeeIcon}
          type="number"
          step="0.01"
          placeholder="Enter course price in ₹"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" },
          })}
          className={errors.price ? "border-red-500" : "border-gray-300"}
        />
        {errors.price && (
          <p className="text-sm text-red-600">{errors.price.message}</p>
        )}

        {/* Category */}
        <Select
          label="Category"
          id="category"
          icon={Tag}
          register={register}
          errors={errors}
          options={categoryOptions}
          required={false}
        />

        {/* Duration */}
        <Input
          label="Duration"
          id="duration"
          icon={Clock}
          placeholder="Enter duration (e.g., 4 weeks)"
          {...register("duration")}
          className="border-gray-300"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            {defaultValues ? "Update Course" : "Add Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
