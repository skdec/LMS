"use client";
import { useEffect } from "react";
import Header from "../header/Header";
import useAdminStore from "@/store/adminStore";
import Sidebar from "../sidebar/Sidebar";

const DashboardLayout = ({ children }) => {
  const { admin, fetchAdmin, loading } = useAdminStore();

  useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          adminname={admin?.firstName || "Admin"}
          avatarUrl={admin?.avatarUrl}
          onLogout={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
          }}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
