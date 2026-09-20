import Stripe from "stripe";
import { PromoCode } from "../models/PromoCode.js";
import { Product } from "../models/Product.js";
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

// @desc    Create Stripe PaymentIntent with Server-Calculated Amount
// @route   POST /api/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  const { items, promoCode, giftWrap, currency = "inr" } = req.body || {};

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart items are required to create payment intent" });
  }

  const productIds = items.map((i) => i.product?.id || i.productId || i.id).filter(Boolean);
  const dbProducts = await Product.find({ id: { $in: productIds } }).lean();

  let serverSubtotal = 0;
  for (const item of items) {
    const prodId = item.product?.id || item.productId || item.id;
    const qty = Math.max(1, Number(item.qty || item.quantity || 1));
    const dbProduct = dbProducts.find((p) => p.id === prodId);
    if (!dbProduct) {
      return res.status(400).json({ error: `Product not found: ${prodId}` });
    }
    serverSubtotal += Number(dbProduct.price) * qty;
  }

  const serverDiscount = await calculatePromoDiscount(promoCode, serverSubtotal);
  const serverShipping = serverSubtotal >= 999 ? 0 : 79;
  const serverGiftCost = giftWrap ? 49 : 0;
  const serverTotal = Math.max(0, serverSubtotal - serverDiscount + serverShipping + serverGiftCost);

  const amountInCents = Math.round(serverTotal * 100);

  if (!stripe) {
    return res.status(200).json({
      isDemo: true,
      message: "Stripe is not configured. Demo payment mode active.",
      serverTotal,
    });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    metadata: { userId: req.user?.id || "guest" },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: serverTotal,
  });
};
