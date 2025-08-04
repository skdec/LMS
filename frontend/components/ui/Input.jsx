// components/ui/Input.jsx
const Input = ({ icon: Icon, className = "", ...rest }) => {
  return (
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
        } ${className}`}
      />
    </div>
  );
};

export default Input;
