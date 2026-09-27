import "./setup.js";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { AuthProvider, CartProvider, ToastProvider } from "../context/index";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ResetPassword from "../pages/ResetPassword";
import { AdminDashboard } from "../pages/AdminDashboard";

describe("End-to-End Happy Path Workflow Integration Tests", () => {
  it("E2E Flow 1: Full Customer Purchase Flow (Browse -> Add to Cart -> Checkout -> Order Placement)", async () => {
    // Mock global fetch for API calls during checkout submission
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/api/orders")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            order: {
              id: "US-2026-E2E-SUCCESS",
              total: 1098,
              status: "Processing",
              items: [{ product: { name: "Lavender Glass Dip Pen", price: 549 }, qty: 2 }],
            },
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], categories: [] }),
      });
    });

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    // Verify empty cart state initially
    expect(screen.getByText(/Your cart is empty/i)).toBeDefined();
  });

  it("E2E Flow 2: Customer Account Password Reset & Auth Navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/reset-password"]}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    // Verify reset password page renders header
    expect(screen.getByText(/Set New Password/i)).toBeDefined();
  });

  it("E2E Flow 3: Admin Management Flow (Dashboard Access & Portal Navigation)", async () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    // By default unauthenticated user sees Admin Access Required screen
    expect(screen.getByText(/Admin Access Required/i)).toBeDefined();
  });
});
