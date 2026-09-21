import express from "express";
import { createPaymentIntent, validatePromoCode, issueSpinPromoCode } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/promo/validate", validatePromoCode);
router.post("/promo/spin", issueSpinPromoCode);

export default router;
