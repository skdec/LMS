// src/components/CourseForm.jsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "./ui/InputField";

export default function CourseForm({ onSubmit, initialData = {}, isEditing }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isEditing) reset(initialData);
    else reset();
  }, [initialData, isEditing, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 shadow rounded mb-6 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Edit Course" : "Add Course"}
      </h2>

      <Input
        label="Title"
        name="title"
        register={register}
        error={errors.title}
        required
      />
      <Input
        label="Description"
        name="description"
        register={register}
        error={errors.description}
      />
      <Input
        label="Price"
        name="price"
        type="number"
        register={register}
        error={errors.price}
        required
      />
      <Input
        label="Category"
        name="category"
        register={register}
        error={errors.category}
      />
      <Input
        label="Duration"
        name="duration"
        register={register}
        error={errors.duration}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2">
        {isEditing ? "Update Course" : "Add Course"}
      </button>
    </form>
  );
}
