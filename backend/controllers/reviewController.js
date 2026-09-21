import crypto from "crypto";
import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { logger } from "../config/logger.js";

const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());
const safeLower = (v) => safeStr(v).toLowerCase();

// Helper to recalculate average product rating and review count for approved reviews
export const recalculateProductRating = async (productId) => {
  if (!productId) return;
  const approvedReviews = await Review.find({ productId, status: "approved" }).lean();
  const reviewCount = approvedReviews.length;
  const totalSum = approvedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
  const avgRating = reviewCount > 0 ? Number((totalSum / reviewCount).toFixed(1)) : 0;

  await Product.findOneAndUpdate({ id: productId }, { rating: avgRating, reviewCount });
};

// @desc    Submit new product review
// @route   POST /api/products/:id/reviews
// @access  Private (Authenticated Buyers Only)
export const submitReview = async (req, res) => {
  const productId = req.params.id;
  const { rating, title, comment, userName, orderId } = req.body || {};

  if (!req.user) {
    return res.status(401).json({ error: "Authentication required to review products" });
  }

  const userId = req.user.id;
  const userEmail = safeLower(req.user.email);
  const cleanName = safeStr(req.user.name) || safeStr(userName) || "Verified Buyer";

  const numRating = Number(rating);
  const cleanTitle = safeStr(title);
  const cleanComment = safeStr(comment);

  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5 stars" });
  }
  if (!cleanTitle || !cleanComment) {
    return res.status(400).json({ error: "Review title and comment are required" });
  }

  // 1. Allow one review per user per product
  const existingReview = await Review.findOne({
    productId,
    $or: [{ userId }, { userEmail: { $ne: "", $eq: userEmail } }],
  }).lean();

  if (existingReview) {
    return res.status(400).json({ error: "You have already submitted a review for this product." });
  }

  // 2. Verified purchase check: verify user owns a Delivered, non-cancelled order containing this product
  const userOrders = await Order.find({
    $or: [{ userId }, { "deliveryAddress.email": userEmail }],
    status: "Delivered",
    paymentStatus: { $nin: ["Cancelled", "Refunded"] },
  }).lean();

  const hasPurchased = userOrders.some(
    (order) =>
      order.status === "Delivered" &&
      Array.isArray(order.items) &&
      order.items.some((item) => (item.product?.id || item.productId || item.id) === productId)
  );

  if (!hasPurchased) {
    return res.status(400).json({ error: "You can only review products that have been purchased and delivered to you." });
  }

  let newReview;
  try {
    newReview = await Review.create({
      id: `rev-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      productId,
      userId,
      orderId: safeStr(orderId),
      userName: cleanName,
      userEmail,
      rating: numRating,
      title: cleanTitle,
      comment: cleanComment,
      verifiedPurchase: true,
      status: "pending",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already submitted a review for this product." });
    }
    throw err;
  }

  logger.info(`[Review Submitted] Product: ${productId}, Rating: ${numRating}★ by ${cleanName} (${userId})`);
  res.status(201).json({ success: true, review: newReview, message: "Thank you for reviewing! Your review has been submitted for approval." });
};

// @desc    Get approved reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ productId: id, status: "approved" }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, reviews, count: reviews.length });
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, reviews, count: reviews.length });
};

// @desc    Update review status (Admin)
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const cleanStatus = safeLower(status);

  if (!["pending", "approved", "rejected"].includes(cleanStatus)) {
    return res.status(400).json({ error: "Invalid status. Must be pending, approved, or rejected" });
  }

  const rev = await Review.findOneAndUpdate({ id }, { status: cleanStatus }, { new: true });
  if (!rev) {
    return res.status(404).json({ error: "Review not found" });
  }

  await recalculateProductRating(rev.productId);

  logger.info(`[Review Status Updated] Review ${id} -> ${cleanStatus}`);
  res.json({ success: true, message: `Review status updated to ${cleanStatus}`, review: rev });
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const deleted = await Review.findOneAndDelete({ id });

  if (!deleted) {
    return res.status(404).json({ error: "Review not found" });
  }

  await recalculateProductRating(deleted.productId);

  logger.info(`[Review Deleted] ID: ${id}`);
  res.json({ success: true, message: "Review deleted successfully" });
};
