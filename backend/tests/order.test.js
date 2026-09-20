import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { Product } from "../models/Product.js";
import { PromoCode } from "../models/PromoCode.js";

describe("Order & Stock Integration Tests", () => {
  it("should create an order and verify server-side totals and stock reduction", async () => {
    // 1. Seed test product & promo code in in-memory database
    const testProduct = await Product.create({
      id: "prod-test-notebook",
      name: "Aesthetic Linen Journal",
      category: "journals",
      price: 500,
      stockCount: 10,
      inStock: true,
    });

    await PromoCode.create({
      code: "WRITE50",
      discountType: "fixed",
      discountValue: 50,
      minOrderAmount: 0,
      isActive: true,
    });

    // 2. Register user & get JWT token
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Order Buyer",
        email: "buyer@example.com",
        password: "password123",
      });

    const token = userRes.body.token;

    // 3. Post order
    const orderRes = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{ product: { id: testProduct.id }, qty: 2 }],
        promoCode: "WRITE50",
        payMethod: "upi",
        deliveryAddress: {
          firstName: "Order",
          lastName: "Buyer",
          email: "buyer@example.com",
          phone: "9876543210",
          address: "123 Aesthetic St",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
      });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.success).toBe(true);

    const order = orderRes.body.order;
    expect(order.subtotal).toBe(1000); // 500 * 2
    expect(order.discount).toBe(50);   // WRITE50 promo ₹50 off
    expect(order.shipping).toBe(0);    // >= 999 free shipping
    expect(order.total).toBe(950);     // 1000 - 50 = 950
    expect(order.userId).toBe(userRes.body.user.id);

    // 4. Verify inventory stock count was reduced from 10 to 8 in database
    const updatedProduct = await Product.findOne({ id: testProduct.id }).lean();
    expect(updatedProduct.stockCount).toBe(8);
  });
});
