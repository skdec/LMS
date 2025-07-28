import React from "react";
import { FaFileUpload } from "react-icons/fa";

const FileUploadField = ({ label, error, required, multiple, ...rest }) => (
  <div className="mb-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <label className="flex flex-col items-center justify-center w-full px-4 py-8 bg-gray-50 text-gray-600 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-blue-50 transition group">
      <FaFileUpload className="text-3xl mb-2 text-blue-400 group-hover:text-blue-600 transition" />
      <span className="text-sm mb-1">Click to upload or drag and drop</span>
      <input type="file" multiple={multiple} className="hidden" {...rest} />
    </label>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

export default FileUploadField;
