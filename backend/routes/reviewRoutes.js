import express from "express";
import {
  submitReview,
  getProductReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public review routes
router.post("/products/:id/reviews", submitReview);
router.get("/products/:id/reviews", getProductReviews);

// Admin review moderation routes
router.get("/reviews", protect, admin, getAllReviews);
router.patch("/reviews/:id/status", protect, admin, updateReviewStatus);
router.delete("/reviews/:id", protect, admin, deleteReview);

export default router;
