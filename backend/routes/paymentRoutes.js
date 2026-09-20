import express from "express";
import { createPaymentIntent, validatePromoCode } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/promo/validate", validatePromoCode);

export default router;
