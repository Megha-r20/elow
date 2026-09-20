import Stripe from "stripe";
import { PromoCode } from "../models/PromoCode.js";
import { logger } from "../config/logger.js";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());

// Helper to calculate server promo discount
export const calculatePromoDiscount = async (code, subtotal) => {
  if (!code) return 0;
  const cleanCode = safeStr(code).toUpperCase();

  let promo = await PromoCode.findOne({ code: cleanCode, isActive: true }).lean();

  if (!promo) {
    const fallbackPromos = {
      WRITE50: { discountType: "fixed", discountValue: 50, minOrderAmount: 0 },
      ELOW10: { discountType: "percentage", discountValue: 10, minOrderAmount: 0 },
      SPIN50: { discountType: "fixed", discountValue: 50, minOrderAmount: 0 },
      SPIN100: { discountType: "fixed", discountValue: 100, minOrderAmount: 0 },
      SPIN150: { discountType: "fixed", discountValue: 150, minOrderAmount: 0 },
      SPIN250: { discountType: "fixed", discountValue: 250, minOrderAmount: 0 },
      SPIN10: { discountType: "fixed", discountValue: 10, minOrderAmount: 0 },
    };
    promo = fallbackPromos[cleanCode];
  }

  if (!promo) return 0;
  if (subtotal < (promo.minOrderAmount || 0)) return 0;

  if (promo.discountType === "percentage") {
    let disc = Math.round((subtotal * promo.discountValue) / 100);
    if (promo.maxDiscount && disc > promo.maxDiscount) {
      disc = promo.maxDiscount;
    }
    return Math.min(disc, subtotal);
  } else {
    return Math.min(promo.discountValue, subtotal);
  }
};

// @desc    Validate promo code
// @route   POST /api/promo/validate
// @access  Public
export const validatePromoCode = async (req, res) => {
  const { code, subtotal = 0 } = req.body || {};
  const cleanCode = safeStr(code).toUpperCase();

  if (!cleanCode) {
    return res.status(400).json({ valid: false, error: "Promo code is required" });
  }

  let promo = await PromoCode.findOne({ code: cleanCode, isActive: true }).lean();

  if (!promo) {
    const fallbackPromos = {
      WRITE50: { discountType: "fixed", discountValue: 50, minOrderAmount: 0 },
      ELOW10: { discountType: "percentage", discountValue: 10, minOrderAmount: 0 },
      SPIN50: { discountType: "fixed", discountValue: 50, minOrderAmount: 0 },
      SPIN100: { discountType: "fixed", discountValue: 100, minOrderAmount: 0 },
      SPIN150: { discountType: "fixed", discountValue: 150, minOrderAmount: 0 },
      SPIN250: { discountType: "fixed", discountValue: 250, minOrderAmount: 0 },
      SPIN10: { discountType: "fixed", discountValue: 10, minOrderAmount: 0 },
    };
    promo = fallbackPromos[cleanCode];
  }

  if (!promo) {
    return res.status(400).json({ valid: false, error: "Invalid promo code" });
  }

  const discountAmount = await calculatePromoDiscount(cleanCode, Number(subtotal) || 1000);
  res.json({
    valid: true,
    code: cleanCode,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    discountAmount,
    message: `Promo code ${cleanCode} applied!`,
  });
};

// @desc    Create Stripe PaymentIntent
// @route   POST /api/create-payment-intent
// @access  Public
export const createPaymentIntent = async (req, res) => {
  const { amount, currency = "inr" } = req.body || {};
  if (!stripe) {
    return res.status(400).json({ error: "Stripe is not configured on backend." });
  }

  const numAmount = Math.round(Number(amount) * 100);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: "Invalid payment amount" });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: numAmount,
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
};
