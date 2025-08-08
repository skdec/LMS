import Invoice from "../models/Invoice.js";
import Course from "../models/Course.js";
import Student from "../models/students.js";
import sendEmail from "../utils/sendEmail.js";

let counter = 1000; // invoice number generator

export const createInvoice = async (req, res) => {
  try {
    const { studentId, courseId, finalFees } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const invoiceNumber = `INV${++counter}`;

    const newInvoice = new Invoice({
      studentId,
      courseId,
      invoiceNumber,
      courseFees: course.price,
      finalFees: finalFees || course.price,
    });

    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("studentId", "candidateName email mobileNo")
      .populate("courseId", "title price");

    // Calculate payment analytics for each invoice
    const invoicesWithAnalytics = invoices.map((invoice) => {
      const totalPaid = invoice.paymentHistory.reduce(
        (sum, p) => sum + p.amountPaid,
        0
      );
      const balance = invoice.finalFees - totalPaid;
      const paymentPercentage = (totalPaid / invoice.finalFees) * 100;

      return {
        ...invoice.toObject(),
        totalPaid,
        balance,
        paymentPercentage: Math.round(paymentPercentage * 100) / 100,
      };
    });

    res.json(invoicesWithAnalytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("studentId", "candidateName email mobileNo")
      .populate("courseId", "title price");

    res.json(invoice);
  } catch (err) {
    res.status(404).json({ message: "Invoice not found" });
  }
};

export const addPayment = async (req, res) => {
  try {
    const { amountPaid, mode } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    invoice.paymentHistory.push({ amountPaid, mode });

    const totalPaid = invoice.paymentHistory.reduce(
      (sum, p) => sum + p.amountPaid,
      0
    );
    if (totalPaid >= invoice.finalFees) invoice.status = "Paid";
    else if (totalPaid > 0) invoice.status = "Partially Paid";

    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update invoice details
export const updateInvoice = async (req, res) => {
  try {
    const { studentId, courseId, finalFees } = req.body;
    const invoiceId = req.params.id;

    // Find the invoice
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Get course details if courseId is being updated
    let courseFees = invoice.courseFees;
    if (courseId && courseId !== invoice.courseId.toString()) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      courseFees = course.price;
    }

    // Update the invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        studentId: studentId || invoice.studentId,
        courseId: courseId || invoice.courseId,
        courseFees,
        finalFees: finalFees || invoice.finalFees,
      },
      { new: true }
    )
      .populate("studentId", "candidateName email mobileNo")
      .populate("courseId", "title price");

    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get payment analytics for admin dashboard
export const getPaymentAnalytics = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("studentId", "candidateName")
      .populate("courseId", "title");

    let totalRevenue = 0;
    let totalPending = 0;
    let totalPaid = 0;
    let monthlyPayments = {};
    let paymentModeBreakdown = {};

    invoices.forEach((invoice) => {
      const totalPaidForInvoice = invoice.paymentHistory.reduce(
        (sum, p) => sum + p.amountPaid,
        0
      );
      const balance = invoice.finalFees - totalPaidForInvoice;

      totalRevenue += invoice.finalFees;
      totalPaid += totalPaidForInvoice;
      totalPending += balance;

      // Group payments by month
      invoice.paymentHistory.forEach((payment) => {
        const month = new Date(payment.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
        if (!monthlyPayments[month]) {
          monthlyPayments[month] = 0;
        }
        monthlyPayments[month] += payment.amountPaid;

        // Payment mode breakdown
        if (payment.mode) {
          if (!paymentModeBreakdown[payment.mode]) {
            paymentModeBreakdown[payment.mode] = 0;
          }
          paymentModeBreakdown[payment.mode] += payment.amountPaid;
        }
      });
    });

    const analytics = {
      totalRevenue,
      totalPaid,
      totalPending,
      totalInvoices: invoices.length,
      monthlyPayments: Object.entries(monthlyPayments)
        .map(([month, amount]) => ({
          month,
          amount,
        }))
        .sort((a, b) => new Date(a.month) - new Date(b.month)),
      paymentModeBreakdown,
    };

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get detailed payment history for a specific invoice
export const getPaymentHistory = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("studentId", "candidateName email mobileNo")
      .populate("courseId", "title price");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const totalPaid = invoice.paymentHistory.reduce(
      (sum, p) => sum + p.amountPaid,
      0
    );
    const balance = invoice.finalFees - totalPaid;
    const paymentPercentage = (totalPaid / invoice.finalFees) * 100;

    // Group payments by month
    const monthlyPayments = {};
    invoice.paymentHistory.forEach((payment) => {
      const month = new Date(payment.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      if (!monthlyPayments[month]) {
        monthlyPayments[month] = [];
      }
      monthlyPayments[month].push(payment);
    });

    const paymentHistory = {
      invoice,
      totalPaid,
      balance,
      paymentPercentage: Math.round(paymentPercentage * 100) / 100,
      monthlyPayments: Object.entries(monthlyPayments)
        .map(([month, payments]) => ({
          month,
          totalAmount: payments.reduce((sum, p) => sum + p.amountPaid, 0),
          payments,
        }))
        .sort((a, b) => new Date(a.month) - new Date(b.month)),
    };

    res.json(paymentHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendInvoiceEmail = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("studentId", "candidateName email mobileNo")
      .populate("courseId", "title price");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    const to = invoice.studentId?.email;
    if (!to || !to.trim()) {
      return res.status(400).json({ message: "Student email not found" });
    }
    const payment = req.body.payment;
    // Helper function for amount in words (simple, for demo)
    function numberToWords(num) {
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
      if (!num) return "Zero";
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
    const subject = `Money Receipt from Dummy Company (#${invoice.invoiceNumber})`;
    // Dummy details
    const companyName = "DUMMY COMPANY NAME";
    const companyAddress =
      "Your Business Address 0000 Main Street, Unit 000C FEL, 0000";
    const companyMobile = "0000-000000";
    const companyEmail = "your@email.com";
    const branch = "Main Branch";
    const account = "1234567890";
    let amount = 0;
    let paymentDate = new Date().toLocaleDateString();
    let paymentMode = "";
    if (payment) {
      amount = payment.amountPaid;
      paymentDate = payment.date
        ? new Date(payment.date).toLocaleDateString()
        : paymentDate;
      paymentMode = payment.mode || "";
    } else {
      amount =
        invoice.paymentHistory?.reduce((sum, p) => sum + p.amountPaid, 0) || 0;
    }
    const amountInWords = numberToWords(amount) + " Rupees Only";
    const courseName = invoice.courseId?.title || "-";
    const html = `
      <div style="max-width:700px;margin:0 auto;border:1px solid #2196f3;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;">
        <div style="background:#2196f3;color:#fff;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:bold;font-size:24px;letter-spacing:1px;">MONEY RECEIPT</div>
            <div style="font-size:14px;">Mob: ${companyMobile} &nbsp; Email: ${companyEmail}</div>
          </div>
          <div style="text-align:right;font-size:13px;">
            <div style="font-weight:bold;">${companyName}</div>
            <div>${companyAddress}</div>
          </div>
        </div>
        <div style="background:#e3f2fd;padding:8px 24px;display:flex;justify-content:space-between;align-items:center;">
          <div>NO: <span style="font-weight:bold;">${
            invoice.invoiceNumber
          }</span></div>
          <div>Date: <span style="font-weight:bold;">${paymentDate}</span></div>
        </div>
        <div style="padding:24px 24px 8px 24px;">
          <div style="margin-bottom:12px;">Received with thanks from <span style="font-weight:bold;">${
            invoice.studentId?.candidateName || "-"
          }</span></div>
          <div style="margin-bottom:12px;">Amount <span style="font-weight:bold;">₹${amount}</span></div>
          <div style="margin-bottom:12px;">Payment Mode <span style="font-weight:bold;">${paymentMode}</span></div>
          <div style="margin-bottom:12px;">In word <span style="font-weight:bold;">${amountInWords}</span></div>
          <div style="margin-bottom:12px;">For <span style="font-weight:bold;">${courseName}</span> &nbsp;&nbsp; Branch <span style="font-weight:bold;">${branch}</span></div>
          <div style="margin-bottom:12px;">ACCT <span style="font-weight:bold;">${account}</span></div>
          <div style="margin-bottom:24px;">Amount= <span style="font-weight:bold;">₹${amount}</span></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:40px;">
            <div>Received by</div>
            <div>Authorized Signature</div>
          </div>
        </div>
      </div>
    `;
    await sendEmail(to, subject, html);
    res.json({ message: "Money receipt sent to student email!" });
  } catch (err) {
    console.error("EMAIL ERROR:", err); // Detailed error logging
    res
      .status(500)
      .json({ message: err.message, stack: err.stack, error: err });
  }
};
