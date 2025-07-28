"use client";

import { forwardRef } from "react";

const Button = forwardRef(({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  ...props
}, ref) => {
  const baseClasses = [
    "inline-flex items-center justify-center gap-2",
    "font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "relative overflow-hidden"
  ].join(" ");

  const variants = {
    primary: [
      "bg-blue-600 text-white shadow-sm",
      "hover:bg-blue-700 hover:shadow-md",
      "focus:ring-blue-500",
      "active:bg-blue-800"
    ].join(" "),
    
    secondary: [
      "bg-white text-gray-700 border border-gray-300 shadow-sm",
      "hover:bg-gray-50 hover:border-gray-400",
      "focus:ring-blue-500",
      "active:bg-gray-100"
    ].join(" "),
    
    danger: [
      "bg-red-600 text-white shadow-sm",
      "hover:bg-red-700 hover:shadow-md", 
      "focus:ring-red-500",
      "active:bg-red-800"
    ].join(" "),
    
    success: [
      "bg-green-600 text-white shadow-sm",
      "hover:bg-green-700 hover:shadow-md",
      "focus:ring-green-500", 
      "active:bg-green-800"
    ].join(" "),
    
    ghost: [
      "bg-transparent text-gray-600 border border-transparent",
      "hover:bg-gray-100 hover:text-gray-900",
      "focus:ring-gray-500",
      "active:bg-gray-200"
    ].join(" "),
    
    outline: [
      "bg-transparent text-blue-600 border border-blue-600",
      "hover:bg-blue-50 hover:border-blue-700",
      "focus:ring-blue-500",
      "active:bg-blue-100"
    ].join(" ")
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs rounded-md",
    sm: "px-3 py-2 text-sm rounded-md", 
    md: "px-4 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };

  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );

  return (
    <button
      ref={ref}
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
