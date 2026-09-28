import mongoose from "mongoose";
import crypto from "crypto";
import { applyIdPlugin } from "./plugins/idPlugin.js";

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    name: { type: String, required: true },
    shortName: { type: String },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    price: { type: Number, required: true, index: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 0 },
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

applyIdPlugin(productSchema, () => crypto.randomUUID());

productSchema.index(
  { name: "text", shortName: "text", description: "text", category: "text", subcategory: "text", tags: "text" },
  { name: "ProductTextIndex", weights: { name: 10, shortName: 8, category: 5, tags: 5, description: 2 } }
);
productSchema.index({ category: 1, inStock: 1, price: 1 });
productSchema.index({ isNew: 1, isBestseller: 1, price: 1 });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
