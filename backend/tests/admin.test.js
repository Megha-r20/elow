import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";

describe("Admin CRUD & Moderation Integration Tests", () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // 1. Create Admin user
    const adminReg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Admin Manager", email: `admin-${Date.now()}@example.com`, password: "password123" });
    adminToken = adminReg.body.token;
    await User.findOneAndUpdate({ email: adminReg.body.user.email }, { role: "admin" });

    // 2. Create Normal User
    const userReg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Normal User", email: `user-${Date.now()}@example.com`, password: "password123" });
    userToken = userReg.body.token;
  });

  it("should allow admin to create, update, and delete a product", async () => {
    // Create Product
    const createRes = await request(app)
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Admin Gel Pen Set",
        category: "pens",
        subcategory: "Gel Pens",
        price: 350,
        originalPrice: 450,
        description: "Smooth pastel gel pens",
        inStock: true,
        stockCount: 25,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.product).toBeDefined();

    const productId = createRes.body.product.id;

    // Update Product
    const updateRes = await request(app)
      .put(`/api/admin/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Admin Gel Pen Set (Updated)",
        category: "pens",
        price: 399,
        stockCount: 15,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.product.name).toBe("Admin Gel Pen Set (Updated)");
    expect(updateRes.body.product.price).toBe(399);

    // Delete Product
    const deleteRes = await request(app)
      .delete(`/api/admin/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const checkProduct = await Product.findOne({ id: productId });
    expect(checkProduct).toBeNull();
  });

  it("should reject product creation from non-admin users (403 Forbidden)", async () => {
    const res = await request(app)
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Unauthorized Pen",
        category: "pens",
        price: 100,
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain("Access denied");
  });

  it("should allow admin to approve and delete customer reviews", async () => {
    // Seed a review in DB
    const review = await Review.create({
      id: `rev-test-${Date.now()}`,
      productId: "prod-sample-123",
      userId: "user-123",
      userName: "Sample Reviewer",
      rating: 5,
      title: "Great Product",
      comment: "Loved the quality and design!",
      status: "pending",
    });

    // Approve Review
    const approveRes = await request(app)
      .patch(`/api/reviews/${review.id}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "approved" });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.review.status).toBe("approved");

    // Delete Review
    const deleteRes = await request(app)
      .delete(`/api/reviews/${review.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const checkReview = await Review.findOne({ id: review.id });
    expect(checkReview).toBeNull();
  });

  it("should handle special regex characters in search query safely without 500 SyntaxError or ReDoS", async () => {
    // Test invalid unescaped regex character like '(' or '(a+)+$'
    const resUnmatched = await request(app).get("/api/products?q=(");
    expect(resUnmatched.status).toBe(200);
    expect(Array.isArray(resUnmatched.body.products)).toBe(true);

    const resReDoS = await request(app).get("/api/products?q=(a+)+$");
    expect(resReDoS.status).toBe(200);
    expect(Array.isArray(resReDoS.body.products)).toBe(true);

    // Test limit=all parameter capping
    const resLimitAll = await request(app).get("/api/products?limit=all");
    expect(resLimitAll.status).toBe(200);
    expect(Array.isArray(resLimitAll.body.products)).toBe(true);
  });
});
