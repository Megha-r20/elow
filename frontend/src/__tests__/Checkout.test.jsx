import "./setup.js";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CartProvider, AuthProvider, ToastProvider, useCart } from "../context/index";
import Checkout from "../pages/Checkout";

const TestCheckoutComponent = () => {
  const { addItem } = useCart();
  return (
    <div>
      <button
        onClick={() =>
          addItem(
            {
              id: "prod-1",
              name: "Aesthetic Washi Tape Set",
              price: 299,
              category: "washi",
              images: ["https://images.unsplash.com/photo-1544816155-12df9643f363"],
            },
            2
          )
        }
      >
        Add Item
      </button>
      <Checkout />
    </div>
  );
};

describe("Checkout Page Integration Tests", () => {
  it("should render empty cart redirect prompt when no items exist", () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Checkout />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/No items to checkout/i)).toBeDefined();
    expect(screen.getByText(/Continue Shopping/i)).toBeDefined();
  });

  it("should render delivery address step and validate required input fields", async () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <TestCheckoutComponent />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    // Add item to cart to enable checkout flow
    fireEvent.click(screen.getByText("Add Item"));

    // Verify delivery step header and items order summary
    expect(screen.getByRole("heading", { name: "Delivery Information" })).toBeDefined();
    expect(screen.getByText("Aesthetic Washi Tape Set")).toBeDefined();

    // Click Continue without filling form to trigger validation errors
    const continueBtn = screen.getByRole("button", { name: /Continue/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(screen.getByText(/10-digit number required/i)).toBeDefined();
    });
  });

  it("should proceed to payment step when valid address is provided", async () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <TestCheckoutComponent />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Add Item"));

    // Fill valid delivery address
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "Ritika" } });
    fireEvent.change(inputs[1], { target: { value: "Sharma" } });
    fireEvent.change(inputs[2], { target: { value: "ritika@example.com" } });
    fireEvent.change(inputs[3], { target: { value: "9876543210" } });
    fireEvent.change(inputs[4], { target: { value: "42 Lotus Lane" } });
    fireEvent.change(inputs[5], { target: { value: "Mumbai" } });
    fireEvent.change(inputs[6], { target: { value: "400050" } });

    const continueBtn = screen.getByRole("button", { name: /Continue/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(screen.getByText(/Payment Method/i)).toBeDefined();
    });
  });
});
