import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true, default: () => `user-${Date.now()}-${crypto.randomBytes(4).toString("hex")}` },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
