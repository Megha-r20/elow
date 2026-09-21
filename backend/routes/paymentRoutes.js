import express from "express";
import { createPaymentIntent, validatePromoCode, issueSpinPromoCode } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { paymentLimiter, promoLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/create-payment-intent", paymentLimiter, createPaymentIntent);
router.post("/promo/validate", promoLimiter, validatePromoCode);
router.post("/promo/spin", protect, promoLimiter, issueSpinPromoCode);

export default router;
