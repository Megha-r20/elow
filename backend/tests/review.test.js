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

    // Create valid delivered order for this product
    await Order.create({
      id: `US-TEST-${Date.now()}`,
      userId: userRes.body.user.id,
      items: [{ product: { id: prodId, name: "Pastel Washi Roll", price: 200 }, qty: 1 }],
      subtotal: 200,
      total: 200,
      status: "Delivered",
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

  it("should reject review submission if order is cancelled or not delivered", async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Cancelled Buyer", email: `cancelled-${Date.now()}@example.com`, password: "password123" });

    // Create cancelled order
    await Order.create({
      id: `US-CANCELLED-${Date.now()}`,
      userId: userRes.body.user.id,
      items: [{ product: { id: prodId, name: "Pastel Washi Roll", price: 200 }, qty: 1 }],
      status: "Cancelled",
      paymentStatus: "Cancelled",
      deliveryAddress: { firstName: "Cancelled", lastName: "Buyer", email: `cancelled-${Date.now()}@example.com`, phone: "9876543210", address: "123 St", city: "Mumbai", pincode: "400001" },
    });

    const reviewRes = await request(app)
      .post(`/api/products/${prodId}/reviews`)
      .set("Authorization", `Bearer ${userRes.body.token}`)
      .send({
        rating: 5,
        title: "Cancelled Review Attempt",
        comment: "My order was cancelled!",
      });

    expect(reviewRes.status).toBe(400);
    expect(reviewRes.body.error).toContain("delivered");
  });

  it("should reject duplicate review submission for the same product", async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Dup Buyer", email: `dup-${Date.now()}@example.com`, password: "password123" });

    const token = userRes.body.token;

    await Order.create({
      id: `US-DUP-${Date.now()}`,
      userId: userRes.body.user.id,
      items: [{ product: { id: prodId, name: "Pastel Washi Roll", price: 200 }, qty: 1 }],
      status: "Delivered",
      deliveryAddress: { firstName: "Dup", lastName: "Buyer", email: `dup-${Date.now()}@example.com`, phone: "9876543210", address: "123 St", city: "Mumbai", pincode: "400001" },
    });

    const review1 = await request(app)
      .post(`/api/products/${prodId}/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5, title: "Review 1", comment: "Great item!" });

    expect(review1.status).toBe(201);

    const review2 = await request(app)
      .post(`/api/products/${prodId}/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 4, title: "Review 2", comment: "Trying to submit again" });

    expect(review2.status).toBe(400);
    expect(review2.body.error).toContain("already submitted");
  });
});
