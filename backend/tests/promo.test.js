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

  it("should issue a single-use spin promo code from POST /api/promo/spin", async () => {
    const spinRes = await request(app)
      .post("/api/promo/spin")
      .send({ email: "spinner@example.com" });

    expect(spinRes.status).toBe(200);
    expect(spinRes.body.sectorIndex).toBeDefined();

    if (spinRes.body.code !== "TRY_AGAIN") {
      expect(spinRes.body.code).toMatch(/^SPIN-/);

      const validateRes = await request(app)
        .post("/api/promo/validate")
        .send({ code: spinRes.body.code, subtotal: 1000 });

      expect(validateRes.status).toBe(200);
      expect(validateRes.body.valid).toBe(true);
    }
  });
});
