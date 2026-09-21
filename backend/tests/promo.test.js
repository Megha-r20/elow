import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { PromoCode } from "../models/PromoCode.js";

describe("Promo Code Integration Tests", () => {
  it("should validate and accept a valid promo code", async () => {
    await PromoCode.create({
      code: "WRITE50",
      discountType: "fixed",
      discountValue: 50,
      minOrderAmount: 0,
      isActive: true,
    });

    const res = await request(app)
      .post("/api/promo/validate")
      .send({ code: "WRITE50", subtotal: 1000 });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.discountAmount).toBe(50);
  });

  it("should reject an invalid promo code (400 Bad Request)", async () => {
    const res = await request(app)
      .post("/api/promo/validate")
      .send({ code: "INVALID99", subtotal: 1000 });

    expect(res.status).toBe(400);
    expect(res.body.valid).toBe(false);
    expect(res.body.error).toContain("Invalid promo code");
  });

  it("should reject an expired promo code", async () => {
    await PromoCode.create({
      code: "EXPIRED10",
      discountType: "percentage",
      discountValue: 10,
      isActive: true,
      expiryDate: new Date("2020-01-01"),
    });

    const res = await request(app)
      .post("/api/promo/validate")
      .send({ code: "EXPIRED10", subtotal: 1000 });

    expect(res.status).toBe(400);
    expect(res.body.valid).toBe(false);
    expect(res.body.error).toContain("expired");
  });

  it("should reject an inactive promo code even if in fallbacks", async () => {
    await PromoCode.create({
      code: "WRITE50",
      discountType: "fixed",
      discountValue: 50,
      isActive: false,
    });

    const res = await request(app)
      .post("/api/promo/validate")
      .send({ code: "WRITE50", subtotal: 1000 });

    expect(res.status).toBe(400);
    expect(res.body.valid).toBe(false);
    expect(res.body.error).toContain("inactive");
  });

  it("should reject POST /api/promo/spin for unauthenticated visitors (401 Unauthorized)", async () => {
    const res = await request(app)
      .post("/api/promo/spin")
      .send({ email: "guest@example.com" });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain("authorized");
  });

  it("should issue a single-use spin promo code with minimum order amount and enforce 1 spin per 24 hours", async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Spinner User", email: "spinner@example.com", password: "password123" });

    const token = userRes.body.token;

    // Spin 1: Succeeds
    const spinRes = await request(app)
      .post("/api/promo/spin")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Spinner User", email: "spinner@example.com" });

    expect(spinRes.status).toBe(200);
    expect(spinRes.body.sectorIndex).toBeDefined();

    if (spinRes.body.code !== "TRY_AGAIN") {
      expect(spinRes.body.code).toMatch(/^SPIN-/);
      expect(spinRes.body.minOrderAmount).toBeGreaterThan(0);

      const validateRes = await request(app)
        .post("/api/promo/validate")
        .send({ code: spinRes.body.code, subtotal: 1000 });

      expect(validateRes.status).toBe(200);
      expect(validateRes.body.valid).toBe(true);
    }

    // Spin 2 (Same User within 24 hours): Rejects with 400
    const secondSpinRes = await request(app)
      .post("/api/promo/spin")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Spinner User", email: "spinner@example.com" });

    expect(secondSpinRes.status).toBe(400);
    expect(secondSpinRes.body.error).toContain("already spun");
  });
});
