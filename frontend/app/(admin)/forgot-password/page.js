"use client";

import { useState } from "react";
import axios from "@/utils/axiosInstance";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/forgot-password", {
        email: data.email,
      });

      setMessage(
        res.data.message || "Reset link sent! Please check your inbox."
      );
      reset();
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-md text-white shadow-xl relative">
        <h2 className="text-3xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Enter your admin email. We&apos;ll send a reset link (valid for 1
          minute).
        </p>

        {message && (
          <div className="bg-green-600/20 border border-green-500 text-green-400 text-sm px-4 py-2 mb-4 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-600/20 border border-red-500 text-red-400 text-sm px-4 py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="text-sm mb-1 block">
              Admin Email
            </label>
            <Mail className="absolute top-[65%] left-3 -translate-y-1/2 text-gray-400 pointer-events-none h-5 w-5" />
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full pl-10 py-2.5 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="admin@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-medium disabled:bg-blue-500/50 transition"
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
