"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReusableTable from "@/components/ui/table";
import SearchInput from "@/components/ui/SearchInput";

const PaymentHistoryPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  // Add search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get("/invoice");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayments = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentDetails(true);
  };

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter((invoice) => {
    const query = searchQuery.toLowerCase();
    const student = invoice.studentId?.candidateName?.toLowerCase() || "";
    const invoiceNumber = String(invoice.invoiceNumber || "").toLowerCase();
    const course = invoice.courseId?.title?.toLowerCase() || "";
    return (
      student.includes(query) ||
      invoiceNumber.includes(query) ||
      course.includes(query)
    );
  });

  // Table columns for payment history
  const columns = [
    { key: "invoiceNumber", label: "Invoice No" },
    {
      key: "studentId",
      label: "Student",
      render: (invoice) => invoice.studentId?.candidateName || "N/A",
    },
    {
      key: "courseId",
      label: "Course",
      render: (invoice) => invoice.courseId?.title || "N/A",
    },
    {
      key: "finalFees",
      label: "Total Amount",
      render: (invoice) => `₹${invoice.finalFees || 0}`,
    },
    {
      key: "totalPaid",
      label: "Paid Amount",
      render: (invoice) => `₹${invoice.totalPaid || 0}`,
    },
    {
      key: "paymentCount",
      label: "Payments",
      render: (invoice) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {invoice.paymentHistory?.length || 0} payments
        </span>
      ),
    },
    {
      key: "lastPayment",
      label: "Last Payment",
      render: (invoice) => {
        const payments = invoice.paymentHistory || [];
        if (payments.length === 0) return "No payments";

        const lastPayment = payments[payments.length - 1];
        return (
          <div className="text-xs">
            <div className="font-medium">₹{lastPayment.amountPaid}</div>
            <div className="text-gray-500">
              {new Date(lastPayment.date).toLocaleDateString()}
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (invoice) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            invoice.status === "Paid"
              ? "bg-green-100 text-green-800"
              : invoice.status === "Partially Paid"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {invoice.status || "Unpaid"}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Payment History
          </h1>
          <p className="text-gray-500 mt-1">
            Track all payment activities and transaction history
          </p>
        </div>

        {/* Payment History Table */}
        {/* Search input */}
        <div className=" mb-4">
          <SearchInput
            placeholder="Search by student, invoice number, course..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full max-w-xs"
          />
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              All Payment Records
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Click on any invoice to view detailed payment history
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading payment history...</p>
            </div>
          ) : (
            <ReusableTable
              data={filteredInvoices}
              columns={columns}
              onView={handleViewPayments}
            />
          )}
        </div>

        {/* Payment Details Modal */}
        {showPaymentDetails && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Payment Details - {selectedInvoice.invoiceNumber}
                </h2>
                <button
                  onClick={() => setShowPaymentDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Invoice Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Invoice Details
                  </h3>
                  <p className="text-sm text-gray-600">
                    #{selectedInvoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedInvoice.studentId?.candidateName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedInvoice.courseId?.title}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Payment Summary
                  </h3>
                  <p className="text-sm text-gray-600">
                    Total: ₹{selectedInvoice.finalFees}
                  </p>
                  <p className="text-sm text-gray-600">
                    Paid: ₹{selectedInvoice.totalPaid || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    Balance: ₹{selectedInvoice.balance || 0}
                  </p>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                {selectedInvoice.paymentHistory &&
                selectedInvoice.paymentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {selectedInvoice.paymentHistory.map((payment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            ₹{payment.amountPaid}
                          </p>
                          <p className="text-sm text-gray-500">
                            {payment.mode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No payments recorded yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistoryPage;
