import mongoose from "mongoose";
import crypto from "crypto";
import { applyIdPlugin } from "./plugins/idPlugin.js";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    address: { type: String, default: "" },
    wishlist: [{ type: String }],
    lastSpinAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockoutUntil: { type: Date, default: null },
    refreshTokens: [{ type: String }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

applyIdPlugin(userSchema, () => crypto.randomUUID());

export const User = mongoose.models.User || mongoose.model("User", userSchema);
