import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    shortName: { type: String },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    price: { type: Number, required: true, index: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    images: [{ type: String }],
    tags: [{ type: String }],
    badge: { type: String },
    badgeVariant: { type: String },
    isNew: { type: Boolean, default: false, index: true },
    isBestseller: { type: Boolean, default: false, index: true },
    description: { type: String },
    details: [{ type: String }],
    inStock: { type: Boolean, default: true, index: true },
    stockCount: { type: Number, default: 10 },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
