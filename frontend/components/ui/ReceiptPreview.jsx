import React from "react";

// Helper function to convert number to words (simple version for demo)
function numberToWords(num) {
  if (!num) return "";
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  if (num < 20) return a[num];
  if (num < 100)
    return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
  if (num < 1000)
    return (
      a[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 ? " " + numberToWords(num % 100) : "")
    );
  if (num < 100000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand" +
      (num % 1000 ? " " + numberToWords(num % 1000) : "")
    );
  if (num < 10000000)
    return (
      numberToWords(Math.floor(num / 100000)) +
      " Lakh" +
      (num % 100000 ? " " + numberToWords(num % 100000) : "")
    );
  return num;
}

const ReceiptPreview = ({ invoice, student, payment }) => {
  // Dummy placeholders
  const companyName = "DUMMY COMPANY NAME";
  const companyAddress =
    "Your Business Address 0000 Main Street, Unit 000C FEL, 0000";
  const companyMobile = "0000-000000";
  const companyEmail = "your@email.com";
  const branch = "Main Branch";
  const account = "1234567890";
  const today = new Date().toLocaleDateString();
  // Last payment date from paymentHistory (if any)
  const lastPaymentDate = invoice?.paymentHistory?.length
    ? new Date(
        invoice.paymentHistory[invoice.paymentHistory.length - 1].date
      ).toLocaleDateString()
    : today;
  // If payment prop is given, use its details, else fallback to invoice totals
  const amount = payment ? payment.amountPaid : invoice?.totalPaid || 0;
  const paymentDate = payment
    ? new Date(payment.date).toLocaleDateString()
    : lastPaymentDate;
  const paymentMode = payment ? payment.mode : "";
  const courseName = invoice?.courseId?.title || invoice?.courseName || "-";
  const amountInWords = numberToWords(amount) + " Rupees Only";
  // Dummy logo and signature (replace with your own URLs)
  const logoUrl = "https://dummyimage.com/60x60/2196f3/fff&text=LOGO";
  const signatureUrl = "https://dummyimage.com/100x40/cccccc/333333&text=Sign";

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "32px auto",
        border: "1.5px solid #2196f3",
        borderRadius: 12,
        boxShadow: "0 4px 24px #2196f344",
        fontFamily: "Segoe UI, Arial, sans-serif",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(90deg, #2196f3 0%, #1976d2 100%)",
          color: "#fff",
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={logoUrl}
            alt="Logo"
            style={{
              height: 48,
              width: 48,
              borderRadius: 8,
              background: "#fff",
            }}
          />
          <div>
            <div style={{ fontSize: 15, marginTop: 4 }}>
              Mob: {companyMobile} &nbsp; | &nbsp; Email: {companyEmail}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 13 }}>
          <div style={{ fontWeight: 600 }}>{companyName}</div>
          <div>{companyAddress}</div>
        </div>
      </div>
      {/* Number & Date */}
      <div
        style={{
          background: "#e3f2fd",
          padding: "10px 32px",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 500,
          fontSize: 15,
        }}
      >
        <div>
          NO:{" "}
          <span style={{ fontWeight: 700 }}>
            {invoice?.invoiceNumber || "-"}
          </span>
        </div>
        <div>
          Date: <span style={{ fontWeight: 700 }}>{today}</span>
        </div>
      </div>
      {/* Payment Date */}
      <div
        style={{
          padding: "8px 32px 0 32px",
          fontSize: 15,
          color: "#1976d2",
          fontWeight: 500,
        }}
      >
        Payment Date: <span style={{ fontWeight: 700 }}>{paymentDate}</span>
      </div>
      {/* Details */}
      <div style={{ padding: "20px 32px 12px 32px", fontSize: 16 }}>
        <div style={{ marginBottom: 14 }}>
          Received with thanks from{" "}
          <span style={{ fontWeight: 600 }}>
            {student?.candidateName || "-"}
          </span>
        </div>
        <div style={{ marginBottom: 14 }}>
          Amount <span style={{ fontWeight: 600 }}>₹{amount}</span>
        </div>
        <div style={{ marginBottom: 14 }}>
          Payment Mode <span style={{ fontWeight: 600 }}>{paymentMode}</span>
        </div>
        <div style={{ marginBottom: 14 }}>
          In word <span style={{ fontWeight: 600 }}>{amountInWords}</span>
        </div>
        <div style={{ marginBottom: 14 }}>
          For <span style={{ fontWeight: 600 }}>{courseName}</span>
          &nbsp; Branch <span style={{ fontWeight: 600 }}>{branch}</span>
        </div>
        <div style={{ marginBottom: 14 }}>
          ACCT <span style={{ fontWeight: 600 }}>{account}</span>
        </div>
        <div style={{ marginBottom: 28 }}>
          Amount= <span style={{ fontWeight: 700 }}>₹{amount}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 40,
            borderTop: "1px solid #e3f2fd",
            paddingTop: 18,
            fontWeight: 500,
            fontSize: 15,
          }}
        >
          <div>Received by</div>
          <div>
            <img
              src={signatureUrl}
              alt="Signature"
              style={{ height: 40, marginBottom: 2 }}
            />
            <div style={{ fontSize: 13, color: "#888" }}>
              Authorized Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;
