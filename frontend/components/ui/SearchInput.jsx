"use client";

import { FiSearch } from "react-icons/fi";

export default function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
  iconClassName = "",
  inputClassName = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${iconClassName}`}
      >
        <FiSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${inputClassName}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
