// utils/axiosInstance.js
import axios from "axios";

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // Make sure your backend is running here
  withCredentials: false, // true if using cookies
});

// ✅ Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken"); // Your token key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token expiration or unauthorized access globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 🔴 Token expired or unauthorized
      localStorage.removeItem("adminToken"); // Clear token
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // 🔁 Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
