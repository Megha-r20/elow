import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { logger } from "../config/logger.js";

const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());
const safeLower = (v) => safeStr(v).toLowerCase();

// @desc    Submit new product review
// @route   POST /api/products/:id/reviews
// @access  Public
export const submitReview = async (req, res) => {
  const productId = req.params.id;
  const { rating, title, comment, userName, userEmail, orderId } = req.body || {};

  const numRating = Number(rating);
  const cleanTitle = safeStr(title);
  const cleanComment = safeStr(comment);
  const cleanName = safeStr(userName) || "Verified Buyer";
  const cleanEmail = safeLower(userEmail);

  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5 stars" });
  }
  if (!cleanTitle || !cleanComment) {
    return res.status(400).json({ error: "Review title and comment are required" });
  }

  const newReview = await Review.create({
    id: `rev-${Date.now()}`,
    productId,
    orderId: safeStr(orderId),
    userName: cleanName,
    userEmail: cleanEmail,
    rating: numRating,
    title: cleanTitle,
    comment: cleanComment,
    verifiedPurchase: true,
    status: "pending",
  });

  logger.info(`[Review Submitted] Product: ${productId}, Rating: ${numRating}★ by ${cleanName}`);
  res.status(201).json({ success: true, review: newReview, message: "Thank you for reviewing! Your review has been submitted for approval." });
};

// @desc    Get approved reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res) => {
  const { id } = req.params;
  const showAll = req.query.all === "true";
  const filter = showAll ? { productId: id } : { productId: id, status: "approved" };

  const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
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
  const newStatus = status === "approved" ? "approved" : "pending";

  const rev = await Review.findOneAndUpdate({ id }, { status: newStatus }, { new: true });
  if (!rev) {
    return res.status(404).json({ error: "Review not found" });
  }

  // Recalculate average rating & review count for approved reviews
  const approvedReviews = await Review.find({ productId: rev.productId, status: "approved" }).lean();
  const reviewCount = approvedReviews.length;
  const totalSum = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviewCount > 0 ? Number((totalSum / reviewCount).toFixed(1)) : 5.0;

  await Product.findOneAndUpdate({ id: rev.productId }, { rating: avgRating, reviewCount });

  logger.info(`[Review Status Updated] Review ${id} -> ${newStatus}`);
  res.json({ success: true, message: `Review status updated to ${newStatus}` });
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

  logger.info(`[Review Deleted] ID: ${id}`);
  res.json({ success: true, message: "Review deleted successfully" });
};
