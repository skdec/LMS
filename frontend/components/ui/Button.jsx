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
    "font-medium rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg";
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 hover:scale-105 animate-pulse-on-hover disabled:bg-blue-300 disabled:shadow-none",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none",
    success:
      "bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 hover:scale-105 animate-glow disabled:bg-green-300 disabled:shadow-none",
    danger:
      "bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 hover:scale-105 animate-shake disabled:bg-red-300 disabled:shadow-none",
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

// Custom animations defined in a style block (could also be in a global CSS file)
const styles = `
  @keyframes pulse-on-hover {
    0% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.7);
    }
    100% {
      box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
    }
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-2px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(2px);
    }
  }

  .animate-pulse-on-hover:hover {
    animation: pulse-on-hover 1.5s infinite;
  }

  .animate-glow:hover {
    animation: glow 1.5s infinite;
  }

  .animate-shake:hover {
    animation: shake 0.5s;
  }
`;

export default Button;
