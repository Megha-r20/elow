import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    orderId: { type: String },
    userName: { type: String, default: "Verified Buyer" },
    userEmail: { type: String, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
