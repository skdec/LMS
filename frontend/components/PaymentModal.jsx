"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import Input from "@/components/ui/Input";
import SelectField from "@/components/ui/SelectField";
import {
  Printer,
  Download,
  Receipt,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";

const PaymentModal = ({ invoice, isOpen, onClose, onPaymentAdded }) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState(null);

  const amountPaid = watch("amountPaid") || 0;
  const balance = invoice ? invoice.finalFees - (invoice.totalPaid || 0) : 0;
  const remainingAfterPayment = balance - amountPaid;

  useEffect(() => {
    if (invoice && isOpen) {
      fetchPaymentHistory();
    }
  }, [invoice, isOpen]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axiosInstance.get(
        `/invoice/${invoice._id}/payment-history`
      );
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const onSubmit = async (data) => {
    if (data.amountPaid > balance) {
      alert("Payment amount cannot exceed remaining balance!");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(`/invoice/add-payment/${invoice._id}`, data);
      reset();
      onPaymentAdded();
      fetchPaymentHistory();
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Failed to add payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const printContent = generatePrintContent();

    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt - ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .receipt { max-width: 400px; margin: 0 auto; border: 2px solid #333; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #1f2937; }
            .invoice-details { margin-bottom: 20px; }
            .payment-summary { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .payment-history { margin-top: 20px; }
            .payment-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .total { font-weight: bold; font-size: 18px; text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px solid #333; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
            @media print { body { margin: 0; } .receipt { border: none; } }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintContent = () => {
    const currentDate = new Date().toLocaleDateString("en-IN");
    const currentTime = new Date().toLocaleTimeString("en-IN");

    return `
      <div class="receipt">
        <div class="header">
          <div class="logo">Digitechmate</div>
          <div>Payment Receipt</div>
          <div style="font-size: 12px; color: #6b7280;">${currentDate} - ${currentTime}</div>
        </div>
        
        <div class="invoice-details">
          <div><strong>Invoice No:</strong> ${invoice.invoiceNumber}</div>
          <div><strong>Student:</strong> ${
            invoice.studentId?.candidateName
          }</div>
          <div><strong>Course:</strong> ${invoice.courseId?.title}</div>
          <div><strong>Mobile:</strong> ${invoice.studentId?.mobileNo}</div>
        </div>
        
        <div class="payment-summary">
          <div style="text-align: center; margin-bottom: 15px; font-weight: bold;">Payment Summary</div>
          <div class="payment-item">
            <span>Total Course Fees:</span>
            <span>₹${invoice.finalFees}</span>
          </div>
          <div class="payment-item">
            <span>Total Paid:</span>
            <span>₹${invoice.totalPaid || 0}</span>
          </div>
          <div class="payment-item">
            <span>Remaining Balance:</span>
            <span>₹${balance}</span>
          </div>
        </div>
        
        ${
          paymentHistory &&
          paymentHistory.monthlyPayments &&
          paymentHistory.monthlyPayments.length > 0
            ? `
          <div class="payment-history">
            <div style="font-weight: bold; margin-bottom: 10px;">Payment History</div>
            ${paymentHistory.monthlyPayments
              .map(
                (monthData) => `
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; color: #374151;">${
                  monthData.month
                }</div>
                                 ${monthData.payments
                                   .map(
                                     (payment) => `
                   <div class="payment-item">
                     <span>₹${payment.amountPaid} - ${payment.mode}</span>
                     <span>${new Date(payment.date).toLocaleDateString()}</span>
                   </div>
                 `
                                   )
                                   .join("")}
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }
        
        <div class="total">
          Payment Status: ${invoice.status}
        </div>
        
        <div class="footer">
          <div>Thank you for choosing Digitechmate!</div>
          <div>For any queries, please contact us.</div>
        </div>
      </div>
    `;
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Receipt className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Payment Management
              </h2>
              <p className="text-sm text-gray-500">
                Invoice #{invoice.invoiceNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-lg"
            >
              ×
            </button>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="text-white w-4 h-4" />
              </div>
              <h3 className="font-semibold text-blue-800">Student Info</h3>
            </div>
            <p className="text-sm text-blue-700 font-medium">
              {invoice.studentId?.candidateName}
            </p>
            <p className="text-xs text-blue-600">
              {invoice.studentId?.mobileNo}
            </p>
            <p className="text-xs text-blue-600">{invoice.studentId?.email}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white w-4 h-4" />
              </div>
              <h3 className="font-semibold text-purple-800">Course Details</h3>
            </div>
            <p className="text-sm text-purple-700 font-medium">
              {invoice.courseId?.title}
            </p>
            <p className="text-xs text-purple-600">
              Invoice: #{invoice.invoiceNumber}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="text-white w-4 h-4" />
              </div>
              <h3 className="font-semibold text-green-800">Payment Summary</h3>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Total:</span>
                <span className="font-medium">₹{invoice.finalFees}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Paid:</span>
                <span className="font-medium text-green-600">
                  ₹{invoice.totalPaid || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Balance:</span>
                <span
                  className={`font-medium ${
                    balance > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ₹{balance}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="text-white w-4 h-4" />
              </div>
              <h3 className="font-semibold text-orange-800">Status</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                invoice.status === "Paid"
                  ? "bg-green-100 text-green-800"
                  : invoice.status === "Partially Paid"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {invoice.status}
            </span>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${invoice.paymentPercentage || 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-orange-600 mt-1">
                {invoice.paymentPercentage || 0}% Complete
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Payment Form */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <CreditCard className="text-white w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Add New Payment
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Input
                  label="Amount to Pay"
                  name="amountPaid"
                  register={register}
                  type="number"
                  required
                  min="0"
                  max={balance}
                />
                <div className="absolute right-3 top-8 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>

              <SelectField
                label="Payment Mode"
                name="mode"
                register={register}
                required
                options={[
                  { value: "Cash", label: "💵 Cash" },
                  { value: "UPI", label: "📱 UPI" },
                  { value: "Card", label: "💳 Card" },
                  { value: "Bank Transfer", label: "🏦 Bank Transfer" },
                  { value: "Cheque", label: "📄 Cheque" },
                ]}
              />

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <p className="text-sm font-medium text-blue-800">
                    Payment Preview
                  </p>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Current Balance:</span>
                    <span className="font-medium">₹{balance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Payment Amount:</span>
                    <span className="font-medium">₹{amountPaid}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-1">
                    <span className="text-blue-800 font-medium">
                      Remaining:
                    </span>
                    <span
                      className={`font-bold ${
                        remainingAfterPayment < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      ₹{remainingAfterPayment}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || amountPaid <= 0 || amountPaid > balance}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Add Payment</span>
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Payment History */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Calendar className="text-white w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Payment History
              </h3>
            </div>

            {paymentHistory ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {paymentHistory.monthlyPayments?.map((monthData, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <h4 className="font-semibold text-indigo-800">
                        {monthData.month}
                      </h4>
                      <span className="ml-auto px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                        ₹{monthData.totalAmount}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {monthData.payments.map((payment, pIndex) => (
                        <div
                          key={pIndex}
                          className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                              <DollarSign className="text-white w-3 h-3" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                ₹{payment.amountPaid}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center space-x-1">
                                <span>{payment.mode}</span>
                                {payment.mode === "Cash" && <span>💵</span>}
                                {payment.mode === "UPI" && <span>📱</span>}
                                {payment.mode === "Card" && <span>💳</span>}
                                {payment.mode === "Bank Transfer" && (
                                  <span>🏦</span>
                                )}
                                {payment.mode === "Cheque" && <span>📄</span>}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(payment.date).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {paymentHistory.monthlyPayments?.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="text-gray-500">No payments recorded yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Payments will appear here once added
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
                <p className="text-gray-500">Loading payment history...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
