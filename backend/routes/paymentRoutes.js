import express from "express";
import {
  createPaymentIntent,
  validatePromoCode,
  issueSpinPromoCode,
  handleStripeWebhook,
  getAllPromosAdmin,
  createPromoAdmin,
  updatePromoAdmin,
  deletePromoAdmin,
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { paymentLimiter, promoLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/create-payment-intent", protect, paymentLimiter, createPaymentIntent);
router.post("/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
router.post("/promo/validate", promoLimiter, validatePromoCode);
router.post("/promo/spin", protect, promoLimiter, issueSpinPromoCode);

// Admin Promo Code routes
router.get("/admin/promo", protect, admin, getAllPromosAdmin);
router.post("/admin/promo", protect, admin, createPromoAdmin);
router.patch("/admin/promo/:id", protect, admin, updatePromoAdmin);
router.delete("/admin/promo/:id", protect, admin, deletePromoAdmin);

export default router;
