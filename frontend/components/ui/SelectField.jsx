import React from "react";

const SelectField = ({
  label,
  options = [],
  error,
  required,
  value,
  onChange,
  ...rest
}) => (
  <div className="mb-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      className={`w-full border px-3 py-2 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-400 transition-all ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      {...(value !== undefined && onChange ? { value, onChange } : { ...rest })}
    >
      <option value="">Select {label}</option>
      {options.map((opt) =>
        typeof opt === "object" ? (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ) : (
          <option key={opt} value={opt}>
            {opt}
          </option>
        )
      )}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

export default SelectField;
