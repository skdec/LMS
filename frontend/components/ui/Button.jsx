"use client";

const Button = ({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled,
  className = "",
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-colors flex items-center justify-center";
  const variants = {
    primary: "bg-red-700 text-white hover:bg-purple-700 disabled:bg-purple-400",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
    success: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
