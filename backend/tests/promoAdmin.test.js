import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { User } from "../models/User.js";
import { PromoCode } from "../models/PromoCode.js";

describe("Admin Promo Code CRUD Integration Tests", () => {
  let adminToken;
  const testCode = `TESTPROMO${Date.now()}`;

  beforeEach(async () => {
    const adminReg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Promo Admin", email: `promoadmin-${Date.now()}@example.com`, password: "password123" });
    adminToken = adminReg.body.token;
    await User.findOneAndUpdate({ email: adminReg.body.user.email }, { role: "admin" });
  });

  afterAll(async () => {
    await PromoCode.deleteMany({ code: testCode });
  });

  it("should allow admin to create a promo code via POST /api/admin/promo", async () => {
    const res = await request(app)
      .post("/api/admin/promo")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        code: testCode,
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 499,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.promo.code).toBe(testCode);
  });

  it("should list all promo codes for admin via GET /api/admin/promo", async () => {
    const res = await request(app)
      .get("/api/admin/promo")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should allow admin to update promo code via PATCH /api/admin/promo/:id", async () => {
    await request(app)
      .post("/api/admin/promo")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        code: testCode,
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 499,
      });

    const res = await request(app)
      .patch(`/api/admin/promo/${testCode}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ discountValue: 25, isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.promo.discountValue).toBe(25);
    expect(res.body.promo.isActive).toBe(false);
  });

  it("should allow admin to delete promo code via DELETE /api/admin/promo/:id", async () => {
    const tempCode = `TEMPPROMO${Date.now()}`;
    await request(app)
      .post("/api/admin/promo")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ code: tempCode, discountType: "fixed", discountValue: 50 });

    const deleteRes = await request(app)
      .delete(`/api/admin/promo/${tempCode}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });
});
