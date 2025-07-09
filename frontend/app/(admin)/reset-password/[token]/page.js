"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "@/utils/axiosInstance";
import { Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(`/auth/reset-password/${token}`, {
        newPassword: data.password,
      });

      setSuccess(res.data.message || "Password reset successfully.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <section className="w-full max-w-md bg-white/10 backdrop-blur-md text-white p-6 rounded-xl shadow-xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-sm text-gray-400 mt-1">
            Enter your new password below
          </p>
        </header>

        {success && (
          <div className="bg-green-600/20 text-green-400 border border-green-500 px-4 py-2 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-600/20 text-red-400 border border-red-500 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-sm">
              New Password
            </label>

            {/* Centered Icon */}
            <span className="absolute  left-3 top-[50%] flex items-center pointer-events-none">
              <Lock className="text-gray-400 w-5 h-5" />
            </span>

            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="w-full pl-10 p-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium transition disabled:bg-green-500/50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
