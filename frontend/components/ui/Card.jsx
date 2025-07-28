"use client";

import { forwardRef } from "react";

const Card = forwardRef(({
  children,
  className = "",
  variant = "default",
  padding = "md",
  shadow = "sm",
  hover = false,
  ...props
}, ref) => {
  const baseClasses = [
    "bg-white rounded-lg border transition-all duration-200"
  ].join(" ");

  const variants = {
    default: "border-gray-200",
    elevated: "border-gray-100 bg-white",
    outline: "border-gray-300",
    ghost: "border-transparent bg-gray-50/50"
  };

  const paddings = {
    none: "p-0",
    xs: "p-2",
    sm: "p-4", 
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  const shadows = {
    none: "shadow-none",
    xs: "shadow-xs",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl"
  };

  const hoverEffect = hover ? "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" : "";

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${paddings[padding]} ${shadows[shadow]} ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

// Sub-components for better composition
const CardHeader = forwardRef(({
  children,
  className = "",
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 pb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
));

const CardTitle = forwardRef(({
  children,
  className = "",
  as: Component = "h2",
  ...props
}, ref) => (
  <Component
    ref={ref}
    className={`text-xl font-semibold text-gray-900 leading-tight ${className}`}
    {...props}
  >
    {children}
  </Component>
));

const CardDescription = forwardRef(({
  children,
  className = "",
  ...props
}, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-600 ${className}`}
    {...props}
  >
    {children}
  </p>
));

const CardContent = forwardRef(({
  children,
  className = "",
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`${className}`}
    {...props}
  >
    {children}
  </div>
));

const CardFooter = forwardRef(({
  children,
  className = "",
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`flex items-center pt-4 ${className}`}
    {...props}
  >
    {children}
  </div>
));

// Set display names for better debugging
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

// Export all components
export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };