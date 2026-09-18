import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shortName: { type: String },
    category: { type: String, required: true },
    subcategory: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    images: [{ type: String }],
    tags: [{ type: String }],
    badge: { type: String },
    badgeVariant: { type: String },
    isNew: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    description: { type: String },
    details: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 10 },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
