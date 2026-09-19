import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
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
    subtotal: { type: Number },
    discount: { type: Number },
    shipping: { type: Number },
    giftCost: { type: Number },
    total: { type: Number },
    status: { type: String, default: "Processing", index: true },
    date: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
