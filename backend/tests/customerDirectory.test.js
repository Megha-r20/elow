import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { User } from "../models/User.js";

describe("Customer Directory & Admin Analytics Integration Tests", () => {
  let adminToken;
  let targetUserEmail;

  beforeEach(async () => {
    const adminReg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Cust Admin", email: `custadmin-${Date.now()}@example.com`, password: "password123" });
    adminToken = adminReg.body.token;
    await User.findOneAndUpdate({ email: adminReg.body.user.email }, { role: "admin" });

    targetUserEmail = `directory-${Date.now()}@example.com`;
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Directory Customer", email: targetUserEmail, password: "password123" });
  });

  it("should fetch customer directory for admin via GET /api/admin/users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should filter customers by search query (name/email)", async () => {
    const res = await request(app)
      .get("/api/admin/users?q=Directory")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((u) => u.name === "Directory Customer")).toBe(true);
  });

  it("should allow admin to update customer role via PATCH /api/admin/users/:id/role", async () => {
    const targetUser = await User.findOne({ email: targetUserEmail });
    expect(targetUser).not.toBeNull();

    const res = await request(app)
      .patch(`/api/admin/users/${targetUser.id}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "admin" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe("admin");
  });

  it("should fetch admin analytics metrics via GET /api/admin/analytics", async () => {
    const res = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("summary");
    expect(res.body).toHaveProperty("orderStatuses");
    expect(res.body).toHaveProperty("salesTrend");
    expect(res.body).toHaveProperty("categorySales");
  });

  it("should correctly aggregate customer orderCount, totalSpent, totalRevenue, and categorySales from Order schema fields", async () => {
    const { Order } = await import("../models/Order.js");

    const targetUser = await User.findOne({ email: targetUserEmail });

    // Create an order matching the Order schema structure
    await Order.create({
      id: `US-TEST-${Date.now()}`,
      userId: targetUser.id,
      items: [
        {
          product: { id: "P001", name: "Test Journal", category: "journals", price: 999 },
          qty: 2,
        },
      ],
      deliveryAddress: {
        firstName: "Directory",
        lastName: "Customer",
        email: targetUserEmail,
        address: "123 Test St",
      },
      payMethod: "upi",
      total: 1998,
      status: "Delivered",
      date: new Date(),
    });

    // Verify GET /api/admin/users aggregates customer order stats correctly
    const usersRes = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(usersRes.status).toBe(200);
    const customerStat = usersRes.body.find((u) => u.email === targetUserEmail);
    expect(customerStat).toBeDefined();
    expect(customerStat.orderCount).toBe(1);
    expect(customerStat.totalSpent).toBe(1998);

    // Verify GET /api/admin/analytics aggregates total revenue and category sales correctly
    const analyticsRes = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(analyticsRes.status).toBe(200);
    expect(analyticsRes.body.summary.totalRevenue).toBe(1998);
    expect(analyticsRes.body.categorySales.length).toBeGreaterThan(0);
    const journalSales = analyticsRes.body.categorySales.find((c) => c.category === "journals");
    expect(journalSales).toBeDefined();
    expect(journalSales.revenue).toBe(1998);
    expect(journalSales.units).toBe(2);
  });
});
