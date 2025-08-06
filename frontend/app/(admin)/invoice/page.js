"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReusableTable from "@/components/ui/table";
import PaymentModal from "@/components/PaymentModal";
import EditInvoiceModal from "@/components/EditInvoiceModal";
import InvoiceAnalytics from "@/components/InvoiceAnalytics";
import { useRouter } from "next/navigation";

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axiosInstance.get("/invoice").then((res) => setInvoices(res.data));
  }, []);

  // Handle viewing invoice details
  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  // Handle updating invoice
  const handleUpdate = (id) => {
    const invoice = invoices.find((inv) => inv._id === id);
    if (invoice) {
      setInvoiceToEdit(invoice);
      setShowEditModal(true);
    }
  };

  // Handle deleting invoice
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axiosInstance.delete(`/invoice/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      alert("Failed to delete the invoice. Please try again.");
    }
  };

  // Table columns configuration
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
      label: "Total Fees",
      render: (invoice) => `₹${invoice.finalFees || 0}`,
    },
    {
      key: "totalPaid",
      label: "Paid Amount",
      render: (invoice) => `₹${invoice.totalPaid || 0}`,
    },
    {
      key: "balance",
      label: "Balance",
      render: (invoice) => (
        <span
          className={`font-medium ${
            invoice.balance > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          ₹{invoice.balance || 0}
        </span>
      ),
    },
    {
      key: "paymentPercentage",
      label: "Payment %",
      render: (invoice) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${invoice.paymentPercentage || 0}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600">
            {invoice.paymentPercentage || 0}%
          </span>
        </div>
      ),
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Invoice Management
            </h1>
            <p className="text-gray-500 mt-1">
              Showing {invoices.length} invoices
            </p>
          </div>
          <button
            onClick={() => router.push("/create-invoice")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create Invoice
          </button>
        </div>

        {/* Analytics Dashboard */}
        <InvoiceAnalytics />

        {/* Invoices table */}
        <ReusableTable
          data={invoices}
          columns={columns}
          onView={handleView}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        {/* Payment Modal */}
        <PaymentModal
          invoice={selectedInvoice}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          onPaymentAdded={() => {
            // Refresh the invoices list
            axiosInstance.get("/invoice").then((res) => setInvoices(res.data));
          }}
        />

        {/* Edit Invoice Modal */}
        <EditInvoiceModal
          invoice={invoiceToEdit}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setInvoiceToEdit(null);
          }}
          onInvoiceUpdated={() => {
            // Refresh the invoices list
            axiosInstance.get("/invoice").then((res) => setInvoices(res.data));
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default InvoiceListPage;
