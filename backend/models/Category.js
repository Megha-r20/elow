import mongoose from "mongoose";
import crypto from "crypto";
import { applyIdPlugin } from "./plugins/idPlugin.js";

const categorySchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    productCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

applyIdPlugin(categorySchema, () => crypto.randomUUID());

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
