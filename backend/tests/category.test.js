import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";

describe("Category Management Integration Tests", () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    const adminReg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Cat Admin", email: `catadmin-${Date.now()}@example.com`, password: "password123" });
    adminToken = adminReg.body.token;
    await User.findOneAndUpdate({ email: adminReg.body.user.email }, { role: "admin" });

    const userReg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Normal Cat User", email: `catuser-${Date.now()}@example.com`, password: "password123" });
    userToken = userReg.body.token;
  });

  afterAll(async () => {
    await Category.deleteMany({ slug: { $in: ["test-journals", "test-washi-tapes"] } });
  });

  it("should list active categories publicly via GET /api/categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should allow admin to create a new category via POST /api/admin/categories", async () => {
    const res = await request(app)
      .post("/api/admin/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Journals",
        slug: "test-journals",
        description: "Handmade eco-friendly journals",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.category.name).toBe("Test Journals");
  });

  it("should reject category creation from non-admin users (403 Forbidden)", async () => {
    const res = await request(app)
      .post("/api/admin/categories")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Test Washi Tapes",
        slug: "test-washi-tapes",
      });

    expect(res.status).toBe(403);
  });

  it("should allow admin to update category via PUT /api/admin/categories/:id", async () => {
    const createRes = await request(app)
      .post("/api/admin/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Test Washi Tapes", slug: "test-washi-tapes" });

    expect(createRes.status).toBe(201);
    const catId = createRes.body.category.id;

    const updateRes = await request(app)
      .put(`/api/admin/categories/${catId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ description: "Updated description for washi tapes" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.category.description).toBe("Updated description for washi tapes");
  });

  it("should allow admin to delete category via DELETE /api/admin/categories/:id", async () => {
    const createRes = await request(app)
      .post("/api/admin/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Temp Category", slug: `temp-${Date.now()}` });

    expect(createRes.status).toBe(201);
    const catId = createRes.body.category.id;

    const deleteRes = await request(app)
      .delete(`/api/admin/categories/${catId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });
});
