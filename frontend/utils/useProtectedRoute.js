"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useProtectedRoute = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/login"); // redirect to login if not authenticated
    }
  }, [router]);
};
