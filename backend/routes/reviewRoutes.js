import express from "express";
import {
  submitReview,
  getProductReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { reviewLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validationMiddleware.js";
import { submitReviewSchema, updateReviewStatusSchema } from "../middleware/schemas.js";

const router = express.Router();

// Public & Customer review routes
router.post("/products/:id/reviews", protect, reviewLimiter, validate(submitReviewSchema), submitReview);
router.get("/products/:id/reviews", getProductReviews);

// Admin review moderation routes
router.get("/reviews", protect, admin, getAllReviews);
router.patch("/reviews/:id/status", protect, admin, validate(updateReviewStatusSchema), updateReviewStatus);
router.delete("/reviews/:id", protect, admin, deleteReview);

export default router;
