import crypto from "crypto";
import Stripe from "stripe";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { PromoCode } from "../models/PromoCode.js";
import { calculatePromoDiscount } from "./paymentController.js";
import { logger } from "../config/logger.js";

export const ORDER_STATUS_TRANSITIONS = {
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());
const safeLower = (v) => safeStr(v).toLowerCase();

const issueStripeRefund = async (intentId) => {
  if (!intentId || !stripe) return false;
  try {
    await stripe.refunds.create({ payment_intent: intentId });
    logger.info(`[Stripe Auto Refund] Successfully refunded PaymentIntent: ${intentId}`);
    return true;
  } catch (err) {
    logger.error(`[Stripe Auto Refund Error] Failed to refund ${intentId}: ${err.message}`);
    return false;
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { items, deliveryAddress, payMethod, promoCode, giftWrap, stripePaymentIntentId } = req.body || {};

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart items are required" });
  }
  if (!deliveryAddress || typeof deliveryAddress !== "object" || !safeStr(deliveryAddress.email) || !safeStr(deliveryAddress.address)) {
    return res.status(400).json({ error: "Valid delivery address and email are required" });
  }

  const productIds = items.map((i) => i.product?.id || i.productId || i.id).filter(Boolean);
  const dbProducts = await Product.find({ id: { $in: productIds } }).lean();

  let serverSubtotal = 0;
  const sanitizedItems = [];

  // Verify DB prices and strictly validate quantity
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

    const currentStock = dbProduct.stockCount !== undefined ? Number(dbProduct.stockCount) : 10;
    if (dbProduct.inStock === false || currentStock < qty) {
      return res.status(400).json({
        error: `Product "${dbProduct.name}" is out of stock or has insufficient quantity. (Requested: ${qty}, Available: ${currentStock})`,
      });
    }

    const unitPrice = Number(dbProduct.price);
    serverSubtotal += unitPrice * qty;

    sanitizedItems.push({
      product: {
        id: dbProduct.id,
        name: dbProduct.name,
        price: unitPrice,
        images: dbProduct.images || [],
        category: dbProduct.category,
      },
      qty,
    });
  }

  const serverDiscount = await calculatePromoDiscount(promoCode, serverSubtotal);
  const serverShipping = serverSubtotal >= 999 ? 0 : 79;
  const serverGiftCost = giftWrap ? 49 : 0;
  const serverTotal = Math.max(0, serverSubtotal - serverDiscount + serverShipping + serverGiftCost);

  // Payment Status & Strict Stripe Verification
  let paymentStatus = "Demo Payment (Pending)";
  const cleanIntentId = safeStr(stripePaymentIntentId);

  if (cleanIntentId) {
    // 1. Prevent reuse of PaymentIntent
    const existingOrder = await Order.findOne({ stripePaymentIntentId: cleanIntentId }).lean();
    if (existingOrder) {
      return res.status(400).json({ error: "Stripe PaymentIntent has already been used for another order." });
    }

    // 2. Verify Stripe configuration & status
    if (!stripe) {
      return res.status(400).json({ error: "Stripe payment service is not configured on backend." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(cleanIntentId);
    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment verification failed. Stripe PaymentIntent was not completed." });
    }

    // 3. Verify paid amount matches server total
    const expectedAmountCents = Math.round(serverTotal * 100);
    if (paymentIntent.amount !== expectedAmountCents) {
      await issueStripeRefund(cleanIntentId);
      return res.status(400).json({
        error: `Payment verification failed. Paid amount (₹${paymentIntent.amount / 100}) does not match server order total (₹${serverTotal}). A full refund has been issued to your card.`,
      });
    }

    paymentStatus = "Paid";
  } else if (payMethod === "cod") {
    paymentStatus = "Pending (COD)";
  } else {
    paymentStatus = "Demo Payment (Pending)";
  }

  // Atomic Stock Reservation (prevents concurrent overselling)
  const reservedProducts = [];
  try {
    for (const item of sanitizedItems) {
      const prodId = item.product.id;
      const qty = item.qty;

      const updatedProd = await Product.findOneAndUpdate(
        { id: prodId, stockCount: { $gte: qty }, inStock: { $ne: false } },
        { $inc: { stockCount: -qty } },
        { new: true }
      );

      if (!updatedProd) {
        // Rollback previously reserved items in this order
        for (const resItem of reservedProducts) {
          await Product.findOneAndUpdate({ id: resItem.id }, { $inc: { stockCount: resItem.qty }, $set: { inStock: true } });
        }

        if (paymentStatus === "Paid" && cleanIntentId) {
          await issueStripeRefund(cleanIntentId);
        }

        return res.status(400).json({
          error: `Product "${item.product.name}" is out of stock or has insufficient quantity. ${paymentStatus === "Paid" ? "A full refund has been issued to your card." : ""}`,
        });
      }

      if (updatedProd.stockCount === 0) {
        await Product.findOneAndUpdate({ id: prodId }, { $set: { inStock: false } });
      }

      reservedProducts.push({ id: prodId, qty });
    }
  } catch (err) {
    for (const resItem of reservedProducts) {
      await Product.findOneAndUpdate({ id: resItem.id }, { $inc: { stockCount: resItem.qty }, $set: { inStock: true } });
    }
    if (paymentStatus === "Paid" && cleanIntentId) {
      await issueStripeRefund(cleanIntentId);
    }
    throw err;
  }

  // Ignore client-sent order ID to prevent duplicate key collisions
  const orderId = `US-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  const orderData = {
    id: orderId,
    userId: req.user.id,
    items: sanitizedItems,
    deliveryAddress,
    payMethod: safeStr(payMethod) || "upi",
    promoCode: safeStr(promoCode),
    paymentStatus,
    ...(cleanIntentId ? { stripePaymentIntentId: cleanIntentId } : {}),
    subtotal: serverSubtotal,
    discount: serverDiscount,
    shipping: serverShipping,
    giftCost: serverGiftCost,
    total: serverTotal,
    status: "Processing",
    date: new Date(),
  };

  let newOrder;
  try {
    newOrder = await Order.create(orderData);
  } catch (err) {
    // Rollback reserved stock if order creation fails
    for (const resItem of reservedProducts) {
      await Product.findOneAndUpdate({ id: resItem.id }, { $inc: { stockCount: resItem.qty }, $set: { inStock: true } });
    }
    if (paymentStatus === "Paid" && cleanIntentId) {
      await issueStripeRefund(cleanIntentId);
    }
    throw err;
  }

  // Mark single-use promo code as used
  if (orderData.promoCode) {
    const cleanCode = safeStr(orderData.promoCode).toUpperCase();
    await PromoCode.findOneAndUpdate(
      { code: cleanCode, isSingleUse: true },
      { $set: { isUsed: true, isActive: false, usedBy: req.user.id } }
    );
  }

  logger.info(`[Order Created] ID: ${orderId}, User: ${req.user.id}, Total: ₹${serverTotal}`);
  res.status(201).json({ success: true, order: newOrder });
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  let mongoQuery = {};

  if (req.user.role === "admin") {
    mongoQuery = {};
  } else {
    mongoQuery = { userId: req.user.id };
  }

  const orders = await Order.find(mongoQuery).sort({ createdAt: -1 }).lean();
  res.json({ orders, count: orders.length });
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findOne({ id: req.params.id }).lean();

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (req.user.role !== "admin" && order.userId !== req.user.id) {
    return res.status(403).json({ error: "Access denied. You can only view your own orders." });
  }

  res.json(order);
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limitParam = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : null;

  const total = await Order.countDocuments({});

  let ordersQuery = Order.find({}).sort({ createdAt: -1 });
  let totalPages = 1;

  if (limitParam && limitParam > 0) {
    const limit = limitParam;
    const skip = (page - 1) * limit;
    ordersQuery = ordersQuery.skip(skip).limit(limit);
    totalPages = Math.ceil(total / limit) || 1;
  }

  const orders = await ordersQuery.lean();

  res.json({
    orders,
    count: orders.length,
    total,
    page,
    totalPages,
  });
};

// @desc    Update order status (Admin)
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body || {};
  const cleanStatus = safeStr(status);

  if (!cleanStatus) {
    return res.status(400).json({ error: "Order status is required" });
  }

  const order = await Order.findOne({ id: req.params.id });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const allowed = ORDER_STATUS_TRANSITIONS[order.status] || [];
  if (!allowed.includes(cleanStatus)) {
    return res.status(400).json({
      error: `Invalid status transition from "${order.status}" to "${cleanStatus}". Allowed transitions: ${allowed.length > 0 ? allowed.join(", ") : "None (Terminal State)"}`,
    });
  }

  order.status = cleanStatus;
  await order.save();

  logger.info(`[Admin Updated Order Status] ID: ${order.id} -> ${cleanStatus}`);
  res.json({ success: true, order: typeof order.toObject === "function" ? order.toObject() : order });
};

// @desc    Delete single order (Admin)
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
export const deleteSingleOrder = async (req, res) => {
  const orderId = req.params.id;
  const deleted = await Order.findOneAndDelete({ id: orderId });

  if (!deleted) {
    return res.status(404).json({ error: "Order not found" });
  }

  logger.info(`[Admin Deleted Order] ID: ${orderId}`);
  res.json({ success: true, message: `Order #${orderId} deleted successfully` });
};

// @desc    Cancel order (Customer / Admin)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({ id: orderId });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (req.user.role !== "admin" && order.userId !== req.user.id) {
    return res.status(403).json({ error: "Access denied. You can only cancel your own orders." });
  }

  const allowed = ORDER_STATUS_TRANSITIONS[order.status] || [];
  if (!allowed.includes("Cancelled")) {
    return res.status(400).json({
      error: `Cannot cancel order with current status "${order.status}". Allowed transitions: ${allowed.length > 0 ? allowed.join(", ") : "None (Terminal State)"}`,
    });
  }

  let refundIssued = false;
  if (order.stripePaymentIntentId && order.paymentStatus === "Paid") {
    refundIssued = await issueStripeRefund(order.stripePaymentIntentId);
    order.paymentStatus = "Refunded";
  } else {
    order.paymentStatus = "Cancelled";
  }

  order.status = "Cancelled";
  await order.save();

  // Restore inventory stock count atomically
  for (const item of order.items || []) {
    const prodId = item.product?.id;
    const qty = Number(item.qty || 1);
    if (prodId) {
      await Product.findOneAndUpdate(
        { id: prodId },
        { $inc: { stockCount: qty }, $set: { inStock: true } }
      );
    }
  }

  logger.info(`[Order Cancelled] ID: ${orderId}, User: ${req.user.id}`);
  res.json({
    success: true,
    message: refundIssued ? "Order cancelled and payment refunded successfully" : "Order cancelled successfully",
    order: typeof order.toObject === "function" ? order.toObject() : order,
  });
};
