import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

describe("Atomic Stock Reservation Concurrency Load Tests", () => {
  let userToken;
  let limitedProduct;

  beforeEach(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Register test customer
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Concurrent Customer", email: "concurrent@example.com", password: "password123" });

    userToken = regRes.body.token;

    // Create a product with ONLY 1 item in stock
    limitedProduct = await Product.create({
      id: `prod-limited-${Date.now()}`,
      name: "Limited Edition Journal",
      category: "journals",
      subcategory: "Hardcover",
      price: 999,
      inStock: true,
      stockCount: 1, // Only 1 available!
    });
  });

  it("should handle 10 simultaneous order requests for low-stock item atomically without overselling", async () => {
    const orderPayload = {
      items: [
        {
          product: { id: limitedProduct.id, name: limitedProduct.name, price: limitedProduct.price },
          qty: 1,
        },
      ],
      deliveryAddress: {
        firstName: "Concurrent",
        lastName: "User",
        email: "concurrent@example.com",
        phone: "9876543210",
        address: "42 High St",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
      },
      payMethod: "upi",
    };

    // Dispatch 10 concurrent requests at the exact same millisecond
    const requests = Array.from({ length: 10 }, () =>
      request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send(orderPayload)
    );

    const responses = await Promise.all(requests);

    const successfulOrders = responses.filter((r) => r.status === 201);
    const failedOrders = responses.filter((r) => r.status === 400);

    // EXACTLY 1 order should succeed
    expect(successfulOrders.length).toBe(1);
    expect(successfulOrders[0].body.success).toBe(true);
    expect(successfulOrders[0].body.order).toHaveProperty("id");

    // The other 9 requests must be rejected with 400 Out of Stock
    expect(failedOrders.length).toBe(9);
    failedOrders.forEach((r) => {
      expect(r.body.error).toMatch(/out of stock|insufficient quantity/i);
    });

    // Check DB product stock state: must be 0 and marked out of stock
    const updatedProd = await Product.findOne({ id: limitedProduct.id }).lean();
    expect(updatedProd.stockCount).toBe(0);
    expect(updatedProd.inStock).toBe(false);

    // Check DB order count: exactly 1 order placed
    const dbOrdersCount = await Order.countDocuments({});
    expect(dbOrdersCount).toBe(1);
  });
});
