"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useProtectedRoute } from "@/utils/useProtectedRoute";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

const DashboardPage = () => {
  useProtectedRoute();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle as="h1" className="text-3xl">Welcome to LMS Admin Dashboard</CardTitle>
            <CardDescription>Manage your learning management system efficiently.</CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="elevated" shadow="md" hover padding="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent>
              <h3 className="text-sm font-medium opacity-90">Total Students</h3>
              <p className="text-3xl font-bold mt-2">1,234</p>
              <p className="text-sm opacity-75 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card variant="elevated" shadow="md" hover padding="lg" className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent>
              <h3 className="text-sm font-medium opacity-90">Active Courses</h3>
              <p className="text-3xl font-bold mt-2">42</p>
              <p className="text-sm opacity-75 mt-1">+3 new courses</p>
            </CardContent>
          </Card>
          
          <Card variant="elevated" shadow="md" hover padding="lg" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent>
              <h3 className="text-sm font-medium opacity-90">Completed Courses</h3>
              <p className="text-3xl font-bold mt-2">89%</p>
              <p className="text-sm opacity-75 mt-1">+5% completion rate</p>
            </CardContent>
          </Card>
          
          <Card variant="elevated" shadow="md" hover padding="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent>
              <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
              <p className="text-3xl font-bold mt-2">$24,580</p>
              <p className="text-sm opacity-75 mt-1">+18% this quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card shadow="md">
            <CardHeader>
              <CardTitle>Recent Students</CardTitle>
              <CardDescription>Latest student enrollments and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "John Doe", course: "React Development", status: "Active" },
                  { name: "Jane Smith", course: "Node.js Backend", status: "Completed" },
                  { name: "Mike Johnson", course: "JavaScript Basics", status: "Active" },
                  { name: "Sarah Wilson", course: "UI/UX Design", status: "Pending" },
                ].map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.course}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800' :
                      student.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card shadow="md">
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
              <CardDescription>Track completion rates and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { course: "React Development", enrolled: 45, completed: 38, progress: 84 },
                  { course: "Node.js Backend", enrolled: 32, completed: 29, progress: 91 },
                  { course: "JavaScript Basics", enrolled: 67, completed: 52, progress: 78 },
                  { course: "UI/UX Design", enrolled: 28, completed: 22, progress: 79 },
                ].map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">{course.course}</span>
                      <span className="text-gray-600 font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{course.completed} completed</span>
                      <span>{course.enrolled} enrolled</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
