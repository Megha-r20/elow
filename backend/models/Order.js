import mongoose from "mongoose";
import crypto from "crypto";

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => `US-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
    },
    userId: { type: String, index: true },
    items: [
      {
        product: { type: Object, required: true },
        qty: { type: Number, required: true },
      },
    ],
    deliveryAddress: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String, index: true },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    payMethod: { type: String },
    promoCode: { type: String },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Pending (COD)", "Demo Payment (Pending)", "Failed", "Refunded", "Cancelled"],
      default: "Pending",
      index: true,
    },
    stripePaymentIntentId: { type: String, sparse: true, unique: true, index: true },
    subtotal: { type: Number },
    discount: { type: Number },
    shipping: { type: Number },
    giftCost: { type: Number },
    total: { type: Number },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
      index: true,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
