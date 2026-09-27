import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app.js";
import { User } from "../models/User.js";

describe("Security & Auth Enhancements Integration Tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("1. Google OAuth Token Verification & Admin Block", () => {
    it("should reject Google Auth sign-in attempts for existing admin accounts", async () => {
      const hashedPass = await bcrypt.hash("adminpassword123", 10);
      await User.create({
        name: "Test Admin",
        email: "admin@example.com",
        password: hashedPass,
        role: "admin",
      });

      const res = await request(app)
        .post("/api/auth/google")
        .send({ email: "admin@example.com", name: "Fake Admin" });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain("Admin accounts must sign in with email and password credentials");
    });

    it("should strictly assign 'user' role to Google OAuth sign-in/registrations", async () => {
      const res = await request(app)
        .post("/api/auth/google")
        .send({ email: "newgoogleuser@example.com", name: "Google Customer" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe("user");
    });
  });

  describe("2. CSRF Validation on /api/auth/refresh", () => {
    it("should allow /api/auth/refresh with valid localhost origin", async () => {
      const regRes = await request(app)
        .post("/api/auth/register")
        .send({ name: "CSRF User", email: "csrf@example.com", password: "password123" });

      const cookieHeader = regRes.headers["set-cookie"][0];

      const res = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", [cookieHeader])
        .set("Origin", "http://localhost:5173");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject /api/auth/refresh with unauthorized cross-site Origin header", async () => {
      const regRes = await request(app)
        .post("/api/auth/register")
        .send({ name: "CSRF Target", email: "csrftarget@example.com", password: "password123" });

      const cookieHeader = regRes.headers["set-cookie"][0];

      const res = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", [cookieHeader])
        .set("Origin", "https://malicious-attacker.com");

      // CORS middleware blocks disallowed Origin with 500/403 before reaching handler
      expect([403, 500]).toContain(res.status);
    });
  });

  describe("3. Account Lockout on Failed Login Attempts", () => {
    it("should lock account for 15 minutes after 5 failed login attempts", async () => {
      const hashedPass = await bcrypt.hash("correctpassword123", 10);
      await User.create({
        name: "Lockout Target",
        email: "lockout@example.com",
        password: hashedPass,
      });

      for (let i = 0; i < 4; i++) {
        const res = await request(app)
          .post("/api/auth/login")
          .send({ email: "lockout@example.com", password: "wrongpassword" });
        expect(res.status).toBe(401);
      }

      // 5th failed attempt triggers lockout
      const fifthRes = await request(app)
        .post("/api/auth/login")
        .send({ email: "lockout@example.com", password: "wrongpassword" });
      expect(fifthRes.status).toBe(401);

      // 6th attempt is blocked by account lockout (429)
      const blockedRes = await request(app)
        .post("/api/auth/login")
        .send({ email: "lockout@example.com", password: "wrongpassword" });
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.body.error).toContain("Account is temporarily locked");
    });
  });

  describe("4. Last Admin Standing & Role Audit Guard", () => {
    it("should prevent demoting the sole remaining admin account", async () => {
      const hashedPass = await bcrypt.hash("adminpassword123", 10);
      const adminUser = await User.create({
        name: "Sole Admin",
        email: "soleadmin@example.com",
        password: hashedPass,
        role: "admin",
      });

      // Log in as admin
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email: "soleadmin@example.com", password: "adminpassword123" });
      const adminToken = loginRes.body.token;

      // Attempt to demote sole admin
      const demoteRes = await request(app)
        .patch(`/api/admin/users/${adminUser.id}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "user" });

      expect(demoteRes.status).toBe(400);
      expect(demoteRes.body.error).toContain("Cannot demote the last remaining admin account");
    });

    it("should allow demoting an admin if another admin account exists", async () => {
      const hashedPass = await bcrypt.hash("adminpassword123", 10);
      await User.create({
        name: "Admin One",
        email: "admin1@example.com",
        password: hashedPass,
        role: "admin",
      });

      const admin2 = await User.create({
        name: "Admin Two",
        email: "admin2@example.com",
        password: hashedPass,
        role: "admin",
      });

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin1@example.com", password: "adminpassword123" });
      const admin1Token = loginRes.body.token;

      const demoteRes = await request(app)
        .patch(`/api/admin/users/${admin2.id}/role`)
        .set("Authorization", `Bearer ${admin1Token}`)
        .send({ role: "user" });

      expect(demoteRes.status).toBe(200);
      expect(demoteRes.body.success).toBe(true);
      expect(demoteRes.body.user.role).toBe("user");
    });
  });
});
