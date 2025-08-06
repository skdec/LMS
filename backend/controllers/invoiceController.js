import Invoice from "../models/Invoice.js";
import Course from "../models/Course.js";
import Student from "../models/students.js";

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
