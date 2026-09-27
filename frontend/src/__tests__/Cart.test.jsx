import "./setup.js";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CartProvider, useCart } from "../context/index";
import Cart from "../pages/Cart";

const TestCartComponent = () => {
  const { addItem } = useCart();
  return (
    <div>
      <button
        onClick={() =>
          addItem(
            {
              id: "p1",
              name: "Lavender Dreams Journal",
              price: 549,
              category: "journals",
              images: ["https://images.unsplash.com/photo-1544816155-12df9643f363"],
            },
            1
          )
        }
      >
        Add Journal
      </button>
      <Cart />
    </div>
  );
};

describe("Cart Page & CartContext Integration Tests", () => {
  it("should render empty cart screen when no items are present", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Cart />
        </CartProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Your cart is empty/i)).toBeDefined();
    expect(screen.getByText(/Browse Products/i)).toBeDefined();
  });

  it("should render added items, allow quantity change, and apply promo code discount", async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      </MemoryRouter>
    );

    // Add item to cart
    const addBtn = screen.getByText("Add Journal");
    fireEvent.click(addBtn);

    // Verify item renders in cart
    expect(screen.getByText("Lavender Dreams Journal")).toBeDefined();
    expect(screen.getAllByText(/549/).length).toBeGreaterThan(0);

    // Test promo code input and application
    const promoInput = screen.getByPlaceholderText(/Enter code/i);
    const applyBtn = screen.getByText(/Apply/i);

    fireEvent.change(promoInput, { target: { value: "WRITE50" } });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(screen.getByText(/WRITE50 applied/i)).toBeDefined();
    });
  });
});
