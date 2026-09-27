import "./setup.js";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider, ToastProvider } from "../context/index";
import { AdminDashboard } from "../pages/AdminDashboard";

const mockAdminUser = {
  id: "user-admin-123",
  name: "Elow Lead Admin",
  email: "admin@elow.com",
  role: "admin",
};

describe("Admin Dashboard Integration & Tab Navigation Tests", () => {
  beforeEach(() => {
    localStorage.setItem("elow_user", JSON.stringify(mockAdminUser));
    localStorage.setItem("elow_token", "mock-token-123");
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/api/auth")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ token: "mock-token-123", user: mockAdminUser }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], orders: [], reviews: [] }),
      });
    });
  });

  it("should format order badges and fallback status safely", () => {
    const getStatusBadgeStyle = (status) => {
      const s = (status || "").toLowerCase();
      if (s === "cancelled") return { color: "#DC2626" };
      if (s === "delivered") return { color: "#16A34A" };
      return { color: "#AB88CD" };
    };

    expect(getStatusBadgeStyle(undefined).color).toBe("#AB88CD");
    expect(getStatusBadgeStyle("Delivered").color).toBe("#16A34A");
    expect(getStatusBadgeStyle("cancelled").color).toBe("#DC2626");
  });

  it("should render Admin Control Center header and top metrics for logged in admin", async () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <AdminDashboard />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/ELOW ADMIN CONTROL CENTER/i)).toBeDefined();
    expect(screen.getByText(/Welcome back, Elow Lead Admin/i)).toBeDefined();
    expect(screen.getByText(/TOTAL REVENUE/i)).toBeDefined();
    expect(screen.getByText(/TOTAL ORDERS/i)).toBeDefined();
    expect(screen.getByText(/TOTAL PRODUCTS/i)).toBeDefined();
  });

  it("should navigate between Admin Portal tabs smoothly", async () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <AdminDashboard />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    // Wait for auth initialization
    await screen.findByText(/ELOW ADMIN CONTROL CENTER/i);

    // Click Products tab
    const productsTabBtn = screen.getByRole("button", { name: /Products/i });
    fireEvent.click(productsTabBtn);
    expect(await screen.findByText(/Product Catalog Management/i)).toBeDefined();

    // Click Categories tab
    const categoriesTabBtn = screen.getByRole("button", { name: /Categories/i });
    fireEvent.click(categoriesTabBtn);
    expect(await screen.findByText(/Category Management/i)).toBeDefined();

    // Click Customers tab
    const customersTabBtn = screen.getByRole("button", { name: /Customers/i });
    fireEvent.click(customersTabBtn);
    expect(await screen.findByRole("heading", { name: /Customer Directory/i })).toBeDefined();

    // Click Orders tab
    const ordersTabBtn = screen.getByRole("button", { name: /Orders/i });
    fireEvent.click(ordersTabBtn);
    expect(await screen.findByText(/Customer Orders Fulfillment/i)).toBeDefined();

    // Click Promo Codes tab
    const promoTabBtn = screen.getByRole("button", { name: /Promo Codes/i });
    fireEvent.click(promoTabBtn);
    expect(await screen.findByText(/Promo Code Admin/i)).toBeDefined();

    // Click Reviews tab
    const reviewsTabBtn = screen.getByRole("button", { name: /Reviews/i });
    fireEvent.click(reviewsTabBtn);
    expect(await screen.findByText(/Customer Product Reviews/i)).toBeDefined();
  });
});
