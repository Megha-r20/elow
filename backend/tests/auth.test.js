import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

describe("Auth & RBAC Integration Tests", () => {
  it("should register a new user successfully (201 Created)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.token).toBeDefined();
  });

  it("should fail registration on duplicate email (400 Bad Request)", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "First User",
        email: "duplicate@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Second User",
        email: "duplicate@example.com",
        password: "password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("already exists");
  });

  it("should log in successfully with correct credentials (200 OK)", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Login User",
        email: "login@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("login@example.com");
  });

  it("should fail login with incorrect password (401 Unauthorized)", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "User One",
        email: "userone@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "userone@example.com",
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });

  it("should return 401 Unauthorized for protected route without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Not authorized");
  });

  it("should return 403 Forbidden when accessing admin route as a normal user", async () => {
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Normal Customer",
        email: "customer@example.com",
        password: "password123",
      });

    const token = regRes.body.token;

    const res = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain("Access denied");
  });

  it("should reject unauthorized origins in production mode via CORS middleware", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    try {
      const allowedRes = await request(app)
        .get("/api/health")
        .set("Origin", "https://elow-store.vercel.app");

      expect(allowedRes.headers["access-control-allow-origin"]).toBe("https://elow-store.vercel.app");

      const deniedRes = await request(app)
        .get("/api/health")
        .set("Origin", "https://malicious-hacker-site.com");

      expect(deniedRes.status).toBe(500);
      expect(deniedRes.body.error).toBe("Internal Server Error");

      const deniedVercelRes = await request(app)
        .get("/api/health")
        .set("Origin", "https://arbitrary-attacker.vercel.app");

      expect(deniedVercelRes.status).toBe(500);
      expect(deniedVercelRes.body.error).toBe("Internal Server Error");
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it("should return 200 OK when DB is connected and 503 Service Unavailable when DB is disconnected", async () => {
    const healthOkRes = await request(app).get("/api/health");
    expect(healthOkRes.status).toBe(200);
    expect(healthOkRes.body.status).toBe("ok");
    expect(healthOkRes.body.database).toBe("connected");

    // Temporarily override readyState on instance
    Object.defineProperty(mongoose.connection, "readyState", {
      get: () => 0,
      configurable: true,
    });

    try {
      const healthErrorRes = await request(app).get("/api/health");
      expect(healthErrorRes.status).toBe(503);
      expect(healthErrorRes.body.status).toBe("error");
      expect(healthErrorRes.body.database).toBe("disconnected");
    } finally {
      delete mongoose.connection.readyState;
    }
  });

  it("should validate profile update and reject unrecognized extra fields via .strict()", async () => {
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Profile User", email: "prof@example.com", password: "password123" });

    const token = regRes.body.token;

    // Unknown extra field should be rejected by .strict()
    const invalidRes = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Profile Updated", unknownField: "hack" });

    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.error).toContain("Validation error");

    // Valid update
    const validRes = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Profile Updated", bio: "Stationery lover" });

    expect(validRes.status).toBe(200);
    expect(validRes.body.success).toBe(true);
    expect(validRes.body.user.name).toBe("Profile Updated");
  });

  it("should reject requests exceeding 10kb body payload limit", async () => {
    const hugePayload = "x".repeat(11 * 1024); // 11KB string payload
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: hugePayload });

    expect(res.status).toBe(413); // Payload Too Large
  });

  it("should issue httpOnly refreshToken cookie on login and allow refreshing access token via /api/auth/refresh", async () => {
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Refresh User", email: "refresh@example.com", password: "password123" });

    expect(regRes.status).toBe(201);
    expect(regRes.headers["set-cookie"]).toBeDefined();
    const cookieHeader = regRes.headers["set-cookie"][0];
    expect(cookieHeader).toContain("refreshToken=");
    expect(cookieHeader).toContain("HttpOnly");

    // Call /api/auth/refresh passing the cookie
    const refreshRes = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", [cookieHeader]);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.token).toBeDefined();
    expect(refreshRes.body.user.email).toBe("refresh@example.com");

    // Test logout clears cookie
    const logoutRes = await request(app)
      .post("/api/auth/logout");

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.headers["set-cookie"]).toBeDefined();
  });

  it("should reject attempts to set role: admin during registration", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Hacker",
        email: "hacker@example.com",
        password: "password123",
        role: "admin",
      });

    // .strict() rejects unrecognized parameter 'role'
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Validation error");
  });

  it("should reject forged JWT tokens (401 Unauthorized)", async () => {
    const forgedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZvcmdlZCIsInJvbGUiOiJhZG1pbiJ9.invalid_signature_hash";
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${forgedToken}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Not authorized");
  });

  it("should reject expired JWT tokens (401 Unauthorized)", async () => {
    const jwt = (await import("jsonwebtoken")).default;
    const { JWT_SECRET } = await import("../middleware/authMiddleware.js");
    const expiredToken = jwt.sign({ id: "user-123", role: "user", type: "access" }, JWT_SECRET, { expiresIn: "-1s" });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Not authorized");
  });

  it("should reject login attempt when passing raw bcrypt hash as password (401 Unauthorized)", async () => {
    const bcrypt = (await import("bcryptjs")).default;
    const rawPassword = "mysecretpassword";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Hash User",
        email: "hashuser@example.com",
        password: rawPassword,
      });

    // User attempts to log in using the bcrypt hash string instead of raw password
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "hashuser@example.com",
        password: hashedPassword,
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });
});
