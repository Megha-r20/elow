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
});
