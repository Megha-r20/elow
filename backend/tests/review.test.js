import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

describe("Review Verification & Submission Integration Tests", () => {
  const prodId = "prod-test-washi-tape";

  beforeEach(async () => {
    await Product.create({
      id: prodId,
      name: "Pastel Washi Roll",
      category: "washi",
      price: 200,
      stockCount: 50,
      inStock: true,
      rating: 0,
      reviewCount: 0,
    });
  });

  it("should reject review submission if user has not purchased the product (403 Forbidden)", async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Non Buyer", email: `nonbuyer-${Date.now()}@example.com`, password: "password123" });

    const reviewRes = await request(app)
      .post(`/api/products/${prodId}/reviews`)
      .set("Authorization", `Bearer ${userRes.body.token}`)
      .send({
        rating: 5,
        title: "False Review",
        comment: "I haven't bought this item yet!",
      });

    expect(reviewRes.status).toBe(400);
    expect(reviewRes.body.error).toContain("purchased");
  });

  it("should allow review submission when user has a valid completed order for the product", async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Verified Buyer", email: `verified-${Date.now()}@example.com`, password: "password123" });

    const token = userRes.body.token;

    // Create valid order for this product
    await Order.create({
      id: `US-TEST-${Date.now()}`,
      userId: userRes.body.user.id,
      items: [{ product: { id: prodId, name: "Pastel Washi Roll", price: 200 }, qty: 1 }],
      subtotal: 200,
      total: 200,
      deliveryAddress: { firstName: "Verified", lastName: "Buyer", email: "verified@example.com", phone: "9876543210", address: "123 St", city: "Mumbai", pincode: "400001" },
    });

    const reviewRes = await request(app)
      .post(`/api/products/${prodId}/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        rating: 5,
        title: "Fantastic Washi Tape",
        comment: "Super cute patterns and good adhesion!",
      });

    expect(reviewRes.status).toBe(201);
    expect(reviewRes.body.success).toBe(true);
    expect(reviewRes.body.review.status).toBe("pending");
  });
});
