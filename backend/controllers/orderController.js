import Stripe from "stripe";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { calculatePromoDiscount } from "./paymentController.js";
import { logger } from "../config/logger.js";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());
const safeLower = (v) => safeStr(v).toLowerCase();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { id, items, deliveryAddress, payMethod, promoCode, giftWrap, stripePaymentIntentId } = req.body || {};

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

  // Verify DB prices and stock
  for (const item of items) {
    const prodId = item.product?.id || item.productId || item.id;
    const qty = Math.max(1, Number(item.qty || item.quantity || 1));
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

  // Stripe Payment Status Verification
  let paymentStatus = "Pending";
  if (payMethod === "card") {
    if (stripePaymentIntentId) {
      if (!stripe) {
        return res.status(400).json({ error: "Stripe payment service is not configured on backend." });
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);
      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        return res.status(400).json({ error: "Payment verification failed. Stripe payment intent was not completed." });
      }
      paymentStatus = "Paid";
    } else {
      paymentStatus = "Paid";
    }
  } else {
    paymentStatus = payMethod === "upi" ? "Paid" : "Pending";
  }

  const orderId = safeStr(id) || `US-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const orderData = {
    id: orderId,
    userId: req.user.id,
    items: sanitizedItems,
    deliveryAddress,
    payMethod: safeStr(payMethod) || "upi",
    promoCode: safeStr(promoCode),
    paymentStatus,
    stripePaymentIntentId: safeStr(stripePaymentIntentId),
    subtotal: serverSubtotal,
    discount: serverDiscount,
    shipping: serverShipping,
    giftCost: serverGiftCost,
    total: serverTotal,
    status: "Processing",
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  };

  const newOrder = await Order.create(orderData);

  // Decrement stock count
  for (const item of sanitizedItems) {
    const prod = await Product.findOne({ id: item.product.id });
    if (prod) {
      prod.stockCount = Math.max(0, (prod.stockCount ?? 10) - item.qty);
      if (prod.stockCount === 0) {
        prod.inStock = false;
      }
      await prod.save();
    }
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
    mongoQuery = {
      $or: [{ userId: req.user.id }, { "deliveryAddress.email": safeLower(req.user.email) }],
    };
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

  if (req.user.role !== "admin" && order.userId !== req.user.id && safeLower(order.deliveryAddress?.email) !== safeLower(req.user.email)) {
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

  const updatedOrder = await Order.findOneAndUpdate({ id: req.params.id }, { status: cleanStatus }, { new: true }).lean();
  if (!updatedOrder) {
    return res.status(404).json({ error: "Order not found" });
  }

  logger.info(`[Admin Updated Order Status] ID: ${updatedOrder.id} -> ${cleanStatus}`);
  res.json({ success: true, order: updatedOrder });
};

// @desc    Delete all orders (Admin)
// @route   DELETE /api/admin/orders
// @access  Private/Admin
export const deleteAllOrders = async (req, res) => {
  await Order.deleteMany({});
  logger.info("[Admin Cleared All Orders]");
  res.json({ success: true, message: "All orders cleared successfully" });
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
