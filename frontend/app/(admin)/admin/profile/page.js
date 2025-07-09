"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Mail, Phone, Edit, Eye, EyeOff } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import axiosInstance from "@/utils/axiosInstance";
import { useProtectedRoute } from "@/utils/useProtectedRoute";

const ProfilePage = () => {
  useProtectedRoute();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
  } = useForm();

  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/profile");
      const data = res.data.profile;
      reset(data);
      setAvatarUrl(data?.avatar?.startsWith("data:") ? data.avatar : null);
    } catch (err) {
      console.error(
        "❌ Fetch profile error:",
        err.response?.data || err.message
      );
      setAvatarUrl(null);
    }
  }, [reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileSize = file.size;
    if (fileSize < 51200 || fileSize > 204800) {
      return alert("Avatar must be between 50 KB and 200 KB");
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await axiosInstance.post("/admin/avatar", formData);
      await fetchProfile();
      alert("Avatar uploaded!");
    } catch (error) {
      console.error("❌ Avatar upload failed:", error);
      alert("Failed to upload avatar.");
      setAvatarUrl(null);
    }
  };

  const onProfileSubmit = async (data) => {
    try {
      const res = await axiosInstance.put("/admin/profile", data);
      if (res.data.success) {
        await fetchProfile();
        alert("Profile updated!");
      }
    } catch (err) {
      console.error(
        "❌ Profile update failed:",
        err.response?.data || err.message
      );
      alert("Something went wrong.");
    }
  };

  const onPasswordSubmit = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await axiosInstance.put("/auth/update-password", {
        currentPassword,
        newPassword,
      });
      alert("Password changed!");
      resetPasswordForm();
    } catch (err) {
      console.error("❌ Password update failed:", err);
      alert("Failed to update password.");
    }
  };

  return (
    <DashboardLayout>
      <main className="p-8 space-y-10">
        {/* ✅ Update Profile Section */}
        <section
          aria-labelledby="profile-heading"
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <header>
            <h2
              id="profile-heading"
              className="text-xl font-semibold mb-6 text-red-700"
            >
              Update Profile
            </h2>
          </header>

          <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <figure className="relative w-24 h-24">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <figcaption className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </figcaption>
                )}
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-1 bg-red-700 text-white rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Edit avatar"
                >
                  <Edit size={16} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </figure>
            </div>

            {/* Profile Fields */}
            <fieldset className="grid grid-cols-2 gap-4">
              <Input label="First Name" {...register("firstName")} />
              <Input label="Last Name" {...register("lastName")} />
              <Input label="Email" {...register("email")} icon={Mail} />
              <Input
                label="Mobile"
                {...register("mobileNumber")}
                icon={Phone}
              />
              <Input label="Gender" {...register("gender")} />
              <Input label="Government ID" {...register("id")} />
              <Input label="Tax ID" {...register("taxId")} />
              <Input label="Tax Country" {...register("taxCountry")} />
              <Input label="Address" {...register("address")} />
            </fieldset>

            <Button type="submit">Save Profile</Button>
          </form>
        </section>

        {/* ✅ Change Password Section */}
        <section
          aria-labelledby="password-heading"
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <header>
            <h2
              id="password-heading"
              className="text-xl font-semibold mb-6 text-red-700"
            >
              Change Password
            </h2>
          </header>

          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            {["currentPassword", "newPassword", "confirmPassword"].map(
              (field) => (
                <div key={field} className="relative">
                  <label
                    htmlFor={field}
                    className="block mb-1 capitalize text-sm text-gray-700"
                  >
                    {field.replace("Password", " Password")}
                  </label>
                  <input
                    id={field}
                    type={showPassword ? "text" : "password"}
                    placeholder={`Enter ${field}`}
                    {...registerPassword(field, {
                      required: true,
                      minLength: 6,
                    })}
                    className="w-full border px-4 py-2 rounded-md"
                  />
                  <span
                    className="absolute top-8 right-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              )
            )}
            <Button type="submit">Update Password</Button>
          </form>
        </section>
      </main>
    </DashboardLayout>
  );
};

export default ProfilePage;
