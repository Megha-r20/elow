import { describe, it, expect } from "vitest";
import request from "supertest";
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
      expect(deniedRes.body.error).toContain("CORS");
    } finally {
      process.env.NODE_ENV = originalEnv;
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
});
