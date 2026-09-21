import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { Product } from "../models/Product.js";
import { PromoCode } from "../models/PromoCode.js";

describe("Order & Stock Integration Tests", () => {
  beforeEach(async () => {
    await Product.create({
      id: "prod-test-notebook",
      name: "Aesthetic Linen Journal",
      category: "journals",
      price: 500,
      stockCount: 10,
      inStock: true,
    });
  });

  it("should create an order and verify server-side totals and stock reduction", async () => {
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
        items: [{ product: { id: "prod-test-notebook" }, qty: 2 }],
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
    expect(order.paymentStatus).toBe("Demo Payment (Pending)");

    // 4. Verify inventory stock count was reduced from 10 to 8 in database
    const updatedProduct = await Product.findOne({ id: "prod-test-notebook" }).lean();
    expect(updatedProduct.stockCount).toBe(8);
  });

  it("should reject fractional item quantities (400 Bad Request)", async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Fractional Buyer", email: "frac@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userRes.body.token}`)
      .send({
        items: [{ product: { id: "prod-test-notebook" }, qty: 2.5 }],
        deliveryAddress: {
          firstName: "Fractional",
          lastName: "Buyer",
          email: "frac@example.com",
          phone: "9876543210",
          address: "123 St",
          city: "Mumbai",
          pincode: "400001",
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("positive integer");
  });

  it("should reject order when stock is insufficient", async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Oversell Buyer", email: "oversell@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userRes.body.token}`)
      .send({
        items: [{ product: { id: "prod-test-notebook" }, qty: 999 }],
        deliveryAddress: {
          firstName: "Oversell",
          lastName: "Buyer",
          email: "oversell@example.com",
          phone: "9876543210",
          address: "123 St",
          city: "Mumbai",
          pincode: "400001",
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("insufficient quantity");
  });

  it("should ignore client-sent id and assign a unique server-generated order ID", async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "ID Buyer", email: "idbuyer@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userRes.body.token}`)
      .send({
        id: "CLIENT-PROPOSED-ID-123",
        items: [{ product: { id: "prod-test-notebook" }, qty: 1 }],
        deliveryAddress: {
          firstName: "ID",
          lastName: "Buyer",
          email: "idbuyer@example.com",
          phone: "9876543210",
          address: "123 St",
          city: "Mumbai",
          pincode: "400001",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.order.id).not.toBe("CLIENT-PROPOSED-ID-123");
    expect(res.body.order.id).toMatch(/^US-\d{4}-/);
  });
});
