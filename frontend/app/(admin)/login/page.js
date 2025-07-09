"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FiUser, FiLock, FiLogIn } from "react-icons/fi";
import axiosInstance from "@/utils/axiosInstance";
import InputField from "@/components/ui/InputField"; // ✅ Path sahi rakho

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/api/auth/login", data);

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        router.push("/dashboard");
      } else {
        setError(response.data.message || "Authentication failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fields for mapping
  const fields = [
    {
      name: "username",
      type: "text",
      icon: FiUser,
      placeholder: "Username",
      autoComplete: "username",
      rules: {
        required: "Username is required",
        minLength: { value: 3, message: "At least 3 characters" },
        pattern: {
          value: /^[a-zA-Z0-9_]+$/,
          message: "Only letters, numbers, and underscores",
        },
      },
    },
    {
      name: "password",
      type: "password",
      icon: FiLock,
      placeholder: "Password",
      autoComplete: "current-password",
      rules: {
        required: "Password is required",
        minLength: { value: 6, message: "At least 6 characters" },
        pattern: {
          value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
          message: "At least one letter and one number",
        },
      },
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Left panel - unchanged */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-white text-center bg-black/20">
          {/* ... your left panel content ... */}
          <h1 className="text-4xl font-bold tracking-wider">LMS</h1>
          <p className="mt-2 text-lg text-gray-300">
            Learning Management System
          </p>
          <p className="mt-6 text-sm text-gray-400 max-w-xs">
            Welcome back! Please enter your credentials to access your admin
            dashboard.
          </p>
        </div>

        {/* Right panel - form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
          <p className="text-gray-400 mb-8">Enter your details below.</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative mb-6">
              <span>{error}</span>
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {fields.map((field) => (
              <InputField
                key={field.name}
                {...field}
                register={register}
                error={errors[field.name]}
              />
            ))}

            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-blue-400 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500/50 transition-all"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing In...
                </>
              ) : (
                <span className="flex items-center">
                  <FiLogIn className="mr-2" />
                  Sign In
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
