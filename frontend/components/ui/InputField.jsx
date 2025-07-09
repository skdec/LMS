// components/ui/InputField.jsx
"use client";

import { useId } from "react";

export default function InputField({
  label,
  type = "text",
  name,
  icon: Icon,
  placeholder,
  register,
  error,
  rules = {},
  autoComplete = "off",
}) {
  const id = useId();

  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
      )}

      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`w-full bg-white/10 text-white placeholder-gray-400 border ${
          error ? "border-red-500/50" : "border-gray-700"
        } rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
      />

      {error && <p className="mt-2 text-sm text-red-400">{error.message}</p>}
    </div>
  );
}
