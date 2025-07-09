import { create } from "zustand";
import axiosInstance from "@/utils/axiosInstance";

const useAdminStore = create((set) => ({
  admin: null,
  loading: true,

  fetchAdmin: async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const res = await axiosInstance.get("/admin/profile");

      if (res.data?.profile) {
        const data = res.data.profile;
        const avatarUrl =
          data.avatar?.startsWith("http") || data.avatar?.startsWith("data:")
            ? data.avatar
            : `http://localhost:3001${data.avatar}`;

        set({ admin: { ...data, avatarUrl }, loading: false });
      }
    } catch (error) {
      console.error("Zustand fetch error:", error);
      set({ admin: null, loading: false });
    }
  },

  setAdmin: (adminData) => set({ admin: adminData }),
}));
export default useAdminStore;
