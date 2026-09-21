import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true, default: "fixed" },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    isActive: { type: Boolean, default: true, index: true },
    expiryDate: { type: Date },
    isSingleUse: { type: Boolean, default: false },
    isUsed: { type: Boolean, default: false },
    usedBy: { type: String },
  },
  { timestamps: true }
);

export const PromoCode = mongoose.models.PromoCode || mongoose.model("PromoCode", promoCodeSchema);
