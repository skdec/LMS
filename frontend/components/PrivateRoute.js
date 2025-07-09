"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PrivateRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading state

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    // Optional: Add an event listener for storage changes (e.g., token removal in another tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsAuthenticated(false);
        router.push("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  // While checking authentication, show a loading state (optional)
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // You can replace this with a spinner or custom UI
  }

  // Render children only if authenticated
  return isAuthenticated ? children : null;
}
