"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import DashboardLayout from "@/components/layout/DashboardLayout";

const PaymentAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get("/invoice/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Payment Analytics
          </h1>
          <p className="text-gray-500 mt-1">
            Comprehensive payment insights and financial overview
          </p>
        </div>

        {/* Analytics Dashboard */}

        {/* Additional Analytics Content */}
        {!loading && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Status Distribution */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Payment Status Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="font-semibold text-green-600">
                    ₹{analytics.totalRevenue?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Collected</span>
                  <span className="font-semibold text-blue-600">
                    ₹{analytics.totalPaid?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Pending Collection
                  </span>
                  <span className="font-semibold text-red-600">
                    ₹{analytics.totalPending?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Collection Rate</span>
                  <span className="font-semibold text-purple-600">
                    {analytics.totalRevenue > 0
                      ? Math.round(
                          (analytics.totalPaid / analytics.totalRevenue) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Payment Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Payment Activity
              </h3>
              {analytics.monthlyPayments &&
              analytics.monthlyPayments.length > 0 ? (
                <div className="space-y-3">
                  {analytics.monthlyPayments
                    .slice(-5)
                    .reverse()
                    .map((monthData, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {monthData.month}
                          </p>
                          <p className="text-sm text-gray-500">
                            Monthly Collection
                          </p>
                        </div>
                        <span className="font-semibold text-green-600">
                          ₹{monthData.amount?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No payment activity recorded yet
                </p>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading analytics...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentAnalyticsPage;
