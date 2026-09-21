import express from "express";
import { createPaymentIntent, validatePromoCode, issueSpinPromoCode, handleStripeWebhook } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { paymentLimiter, promoLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/create-payment-intent", protect, paymentLimiter, createPaymentIntent);
router.post("/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
router.post("/promo/validate", promoLimiter, validatePromoCode);
router.post("/promo/spin", protect, promoLimiter, issueSpinPromoCode);

export default router;
