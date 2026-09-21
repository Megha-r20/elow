import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../context/index";

describe("CartContext State & Operations Tests", () => {
  const sampleProduct = {
    id: "prod-pen-1",
    name: "Gel Pen Set",
    price: 250,
  };

  it("should throw error if useCart is used outside CartProvider", () => {
    expect(() => renderHook(() => useCart())).toThrow();
  });

  it("should initialize with empty cart state", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("should add item to cart and calculate totals correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addItem(sampleProduct, 2);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.count).toBe(2);
    expect(result.current.subtotal).toBe(500);
  });

  it("should update quantity and remove item when quantity set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addItem(sampleProduct, 3);
    });

    act(() => {
      result.current.setQty(sampleProduct.id, 1);
    });

    expect(result.current.count).toBe(1);

    act(() => {
      result.current.removeItem(sampleProduct.id);
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.count).toBe(0);
  });

  it("should apply promo code discount correctly", async () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addItem(sampleProduct, 4); // subtotal = 1000
    });

    let res;
    await act(async () => {
      res = await result.current.applyPromo("WRITE50");
    });

    expect(res.success).toBe(true);
    expect(result.current.promoCode).toBe("WRITE50");
    expect(result.current.discount).toBe(100); // 10% of 1000 = 100
  });
});
