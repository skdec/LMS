import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  addPayment,
  deleteInvoice,
  updateInvoice,
  getPaymentAnalytics,
  getPaymentHistory,
  sendInvoiceEmail,
} from "../controllers/invoiceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createInvoice);
router.get("/", authMiddleware, getAllInvoices);
router.get("/analytics", authMiddleware, getPaymentAnalytics);
router.get("/:id", authMiddleware, getInvoiceById);
router.get("/:id/payment-history", authMiddleware, getPaymentHistory);
router.put("/add-payment/:id", authMiddleware, addPayment);
router.put("/:id", authMiddleware, updateInvoice);
router.delete("/:id", authMiddleware, deleteInvoice);
router.post("/:id/send-email", authMiddleware, sendInvoiceEmail);

export default router;
