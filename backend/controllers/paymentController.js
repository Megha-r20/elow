import Stripe from "stripe";
import { PromoCode } from "../models/PromoCode.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { logger } from "../config/logger.js";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());

// Helper to look up and validate promo code
export const getPromoObject = async (code) => {
  if (!code) return { valid: false, error: "Promo code is required" };
  const cleanCode = safeStr(code).toUpperCase();

  // 1. Database Promo Check (DB records take priority over fallbacks)
  let dbPromo = await PromoCode.findOne({ code: cleanCode }).lean();

  if (dbPromo) {
    if (dbPromo.isActive === false) {
      return { valid: false, error: "Promo code is inactive" };
    }
    if (dbPromo.expiryDate && new Date() > new Date(dbPromo.expiryDate)) {
      return { valid: false, error: "Promo code has expired" };
    }
    if (dbPromo.isSingleUse && dbPromo.isUsed) {
      return { valid: false, error: "Promo code has already been used" };
    }
    return { valid: true, promo: dbPromo };
  }

  // 2. Fallback Promos (only if DB has no record for this code)
  const fallbackPromos = {
    WRITE50: { code: "WRITE50", discountType: "fixed", discountValue: 50, minOrderAmount: 0, isActive: true },
    ELOW10: { code: "ELOW10", discountType: "percentage", discountValue: 10, minOrderAmount: 0, isActive: true },
  };

  const fallback = fallbackPromos[cleanCode];
  if (!fallback) {
    return { valid: false, error: "Invalid promo code" };
  }

  if (fallback.isActive === false) {
    return { valid: false, error: "Promo code is inactive" };
  }
  if (fallback.expiryDate && new Date() > new Date(fallback.expiryDate)) {
    return { valid: false, error: "Promo code has expired" };
  }

  return { valid: true, promo: fallback };
};

// Helper to calculate server promo discount
export const calculatePromoDiscount = async (code, subtotal) => {
  if (!code) return 0;
  const cleanCode = safeStr(code).toUpperCase();

  const res = await getPromoObject(cleanCode);
  if (!res.valid || !res.promo) return 0;

  const promo = res.promo;
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

  const promoRes = await getPromoObject(cleanCode);
  if (!promoRes.valid || !promoRes.promo) {
    return res.status(400).json({ valid: false, error: promoRes.error || "Invalid promo code" });
  }

  const promo = promoRes.promo;
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

// @desc    Issue single-use promo code from spin wheel
// @route   POST /api/promo/spin
// @access  Private
export const issueSpinPromoCode = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication required to spin the wheel" });
  }

  const user = await User.findOne({ id: req.user.id });
  if (!user) {
    return res.status(401).json({ error: "User session invalid or expired" });
  }

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  if (user.lastSpinAt && Date.now() - new Date(user.lastSpinAt).getTime() < TWENTY_FOUR_HOURS) {
    const hoursRemaining = Math.ceil((TWENTY_FOUR_HOURS - (Date.now() - new Date(user.lastSpinAt).getTime())) / (60 * 60 * 1000));
    return res.status(400).json({
      error: `You have already spun the wheel today! Please try again in ${hoursRemaining} hour(s).`,
    });
  }

  const SECTORS = [
    { label: "₹50 OFF", value: 50, sectorIndex: 0 },
    { label: "₹100 OFF", value: 100, sectorIndex: 1 },
    { label: "NO LUCK", value: 0, sectorIndex: 2 },
    { label: "₹150 OFF", value: 150, sectorIndex: 3 },
    { label: "₹50 OFF", value: 50, sectorIndex: 4 },
    { label: "₹250 OFF", value: 250, sectorIndex: 5 },
  ];

  const MIN_ORDER_AMOUNTS = {
    50: 299,
    100: 499,
    150: 699,
    250: 999,
  };

  const winningIndices = [0, 1, 3, 4, 5];
  const winningIndex = winningIndices[Math.floor(Math.random() * winningIndices.length)];
  const prize = SECTORS[winningIndex];

  // Record user's last spin timestamp
  user.lastSpinAt = new Date();
  await user.save();

  if (prize.value === 0) {
    return res.json({
      sectorIndex: prize.sectorIndex,
      code: "TRY_AGAIN",
      label: prize.label,
      discountValue: 0,
    });
  }

  const minOrderAmount = MIN_ORDER_AMOUNTS[prize.value] || 299;

  // Generate unique single-use code
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const newCode = `SPIN-${randomSuffix}`;
  const expiryDate = new Date(Date.now() + TWENTY_FOUR_HOURS);

  const spinPromo = await PromoCode.create({
    code: newCode,
    discountType: "fixed",
    discountValue: prize.value,
    minOrderAmount,
    isActive: true,
    expiryDate,
    isSingleUse: true,
    isUsed: false,
    usedBy: user.id,
  });

  logger.info(`[Spin Promo Issued] Code: ${newCode}, Value: ₹${prize.value}, MinOrder: ₹${minOrderAmount}, User: ${user.email}`);

  res.json({
    sectorIndex: prize.sectorIndex,
    code: newCode,
    label: prize.label,
    discountValue: prize.value,
    minOrderAmount,
    expiryDate: spinPromo.expiryDate,
  });
};

// @desc    Create Stripe PaymentIntent with Server-Calculated Amount
// @route   POST /api/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication required to create payment intent" });
  }

  const { items, promoCode, giftWrap, currency = "inr" } = req.body || {};

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart items are required to create payment intent" });
  }

  const productIds = items.map((i) => i.product?.id || i.productId || i.id).filter(Boolean);
  const dbProducts = await Product.find({ id: { $in: productIds } }).lean();

  let serverSubtotal = 0;
  for (const item of items) {
    const prodId = item.product?.id || item.productId || item.id;
    const rawQty = item.qty !== undefined ? item.qty : item.quantity;
    if (rawQty === undefined || typeof rawQty !== "number" || !Number.isInteger(rawQty) || rawQty <= 0) {
      return res.status(400).json({ error: "Item quantity must be a positive integer" });
    }
    const qty = rawQty;

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
    metadata: { userId: req.user.id },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: serverTotal,
  });
};

// @desc    Handle Stripe Webhooks
// @route   POST /api/payments/webhook
// @access  Public (Stripe Webhook Signature Verification)
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  if (stripe && webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      logger.error(`[Stripe Webhook Error] Signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Graceful fallback for development / test mode when webhook secret is omitted
    event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  if (!event || !event.type) {
    return res.status(400).json({ error: "Invalid webhook payload format" });
  }

  const { Order } = await import("../models/Order.js");

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
      if (order && order.paymentStatus !== "Paid") {
        order.paymentStatus = "Paid";
        await order.save();
        logger.info(`[Stripe Webhook] Order #${order.id} marked as Paid via payment_intent.succeeded`);
      }
      break;
    }
    case "charge.refunded":
    case "payment_intent.canceled": {
      const paymentIntent = event.data.object;
      const intentId = paymentIntent.payment_intent || paymentIntent.id;
      const order = await Order.findOne({ stripePaymentIntentId: intentId });
      if (order) {
        order.paymentStatus = "Refunded";
        if (order.status !== "Cancelled") {
          order.status = "Cancelled";
        }
        await order.save();
        logger.info(`[Stripe Webhook] Order #${order.id} marked as Refunded via ${event.type}`);
      }
      break;
    }
    default:
      logger.info(`[Stripe Webhook] Received unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
