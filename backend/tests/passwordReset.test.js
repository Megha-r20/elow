import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Password Reset Integration Tests", () => {
  let testEmail;

  beforeEach(async () => {
    testEmail = `pwreset-${Date.now()}@example.com`;
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Password Reset User", email: testEmail, password: "OldPassword123!" });
  });

  it("should generate reset token via POST /api/auth/forgot-password", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: testEmail });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should allow resetting password using valid token via POST /api/auth/reset-password", async () => {
    const forgotRes = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: testEmail });

    const token = forgotRes.body.resetToken;
    expect(token).toBeDefined();

    const resetRes = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token,
        newPassword: "BrandNewPassword123!",
      });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    // Verify user can log in with new password
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "BrandNewPassword123!",
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
  });

  it("should reject reset attempts with an invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: "invalid-token-1234567890",
        newPassword: "NewPassword123!",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("invalid or has expired");
  });
});
