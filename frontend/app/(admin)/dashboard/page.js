"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import CountUp from "react-countup";
import {
  GraduationCap,
  BookOpen,
  FileText,
  IndianRupee,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const DashboardPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [studentsRes, coursesRes, invoicesRes] = await Promise.all([
          axiosInstance.get("/get-students"),
          axiosInstance.get("/get-course"),
          axiosInstance.get("/invoice"),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
        setInvoices(invoicesRes.data);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate total revenue from invoices
  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + (inv.totalPaid || 0),
    0
  );

  // Prepare data for invoices per month graph
  const invoicesPerMonth = (() => {
    const monthMap = {};
    invoices.forEach((inv) => {
      const date = new Date(inv.createdAt);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthMap[month] = (monthMap[month] || 0) + 1;
    });
    // Sort by date ascending
    return Object.entries(monthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  })();

  // Prepare data for student registrations per month graph
  const studentsPerMonth = (() => {
    const monthMap = {};
    students.forEach((student) => {
      if (!student.admissionDate) return;
      const date = new Date(student.admissionDate);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthMap[month] = (monthMap[month] || 0) + 1;
    });
    return Object.entries(monthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  })();

  // Prepare data for course enrollments distribution
  const courseEnrollmentMap = {};
  students.forEach((student) => {
    if (!student.nameOfProgramme) return;
    courseEnrollmentMap[student.nameOfProgramme] =
      (courseEnrollmentMap[student.nameOfProgramme] || 0) + 1;
  });
  const courseEnrollmentData = Object.entries(courseEnrollmentMap).map(
    ([name, value]) => ({ name, value })
  );
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#d8854f",
  ];

  // Calculate previous month metrics for trends
  function getPrevMonthKey() {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return now.toLocaleString("default", { month: "short", year: "numeric" });
  }
  const prevMonthKey = getPrevMonthKey();
  const prevStudents = students.filter((s) => {
    if (!s.admissionDate) return false;
    const date = new Date(s.admissionDate);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    return month === prevMonthKey;
  }).length;
  const currMonthKey = new Date().toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
  const currStudents = students.filter((s) => {
    if (!s.admissionDate) return false;
    const date = new Date(s.admissionDate);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    return month === currMonthKey;
  }).length;
  const studentTrend =
    prevStudents === 0
      ? 0
      : ((currStudents - prevStudents) / prevStudents) * 100;

  // Revenue trend
  const prevRevenue = invoices.reduce((sum, inv) => {
    const date = new Date(inv.createdAt);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    return month === prevMonthKey ? sum + (inv.totalPaid || 0) : sum;
  }, 0);
  const currRevenue = invoices.reduce((sum, inv) => {
    const date = new Date(inv.createdAt);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    return month === currMonthKey ? sum + (inv.totalPaid || 0) : sum;
  }, 0);
  const revenueTrend =
    prevRevenue === 0 ? 0 : ((currRevenue - prevRevenue) / prevRevenue) * 100;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-8">
          Admin Dashboard
        </h1>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Students Card */}
            <div className="bg-blue-50 p-6 rounded-lg shadow flex flex-col items-center relative overflow-hidden">
              <GraduationCap className="text-4xl text-blue-400 mb-2" />
              <span className="text-3xl font-bold text-blue-700">
                <CountUp end={students.length} duration={1.2} separator="," />
              </span>
              <span className="mt-2 text-blue-900 font-medium">
                Total Students
              </span>
              <span className="flex items-center mt-2 text-sm">
                {studentTrend > 0 ? (
                  <ArrowUp className="text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="text-red-500 mr-1" />
                )}
                {Math.abs(studentTrend).toFixed(1)}% from last month
              </span>
            </div>
            {/* Courses Card */}
            <div className="bg-green-50 p-6 rounded-lg shadow flex flex-col items-center relative overflow-hidden">
              <BookOpen className="text-4xl text-green-400 mb-2" />
              <span className="text-3xl font-bold text-green-700">
                <CountUp end={courses.length} duration={1.2} separator="," />
              </span>
              <span className="mt-2 text-green-900 font-medium">
                Total Courses
              </span>
            </div>
            {/* Invoices Card */}
            <div className="bg-purple-50 p-6 rounded-lg shadow flex flex-col items-center relative overflow-hidden">
              <FileText className="text-4xl text-purple-400 mb-2" />
              <span className="text-3xl font-bold text-purple-700">
                <CountUp end={invoices.length} duration={1.2} separator="," />
              </span>
              <span className="mt-2 text-purple-900 font-medium">
                Total Invoices
              </span>
            </div>
            {/* Revenue Card */}
            <div className="bg-yellow-50 p-6 rounded-lg shadow flex flex-col items-center relative overflow-hidden">
              <IndianRupee className="text-4xl text-yellow-400 mb-2" />
              <span className="text-3xl font-bold text-yellow-700">
                <CountUp end={totalRevenue} duration={1.2} separator="," />
              </span>
              <span className="mt-2 text-yellow-900 font-medium">
                Total Revenue
              </span>
              <span className="flex items-center mt-2 text-sm">
                {revenueTrend > 0 ? (
                  <ArrowUp className="text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="text-red-500 mr-1" />
                )}
                {Math.abs(revenueTrend).toFixed(1)}% from last month
              </span>
            </div>
          </div>
        )}
        {/* Graphs will be added below in the next steps */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Invoices Issued Per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={invoicesPerMonth}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">
            Student Registrations Per Month
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={studentsPerMonth}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">
            Course Enrollments Distribution
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={courseEnrollmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {courseEnrollmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
