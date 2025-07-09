// components/ui/Input.jsx
const Input = ({ label, icon: Icon, ...rest }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-2 flex items-center text-gray-500">
            <Icon size={16} />
          </span>
        )}
        <input
          {...rest}
          className={`w-full border px-3 py-2 rounded-md text-gray-900 placeholder:text-gray-600 ${
            Icon ? "pl-8" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default Input;
