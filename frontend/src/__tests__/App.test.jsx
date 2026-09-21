import { describe, it, expect } from "vitest";
import { CATEGORIES, SORT_OPTIONS, PRICE_RANGES, HERO_IMAGES } from "../data";

describe("Frontend Data & Export Smoke Tests", () => {
  it("should contain valid product category metadata", () => {
    expect(CATEGORIES).toBeDefined();
    expect(Array.isArray(CATEGORIES)).toBe(true);
    expect(CATEGORIES.length).toBeGreaterThan(0);
    expect(CATEGORIES[0]).toHaveProperty("id");
    expect(CATEGORIES[0]).toHaveProperty("label");
  });

  it("should contain valid sort options", () => {
    expect(SORT_OPTIONS).toBeDefined();
    expect(SORT_OPTIONS.some((opt) => opt.value === "featured")).toBe(true);
    expect(SORT_OPTIONS.some((opt) => opt.value === "price-asc")).toBe(true);
  });

  it("should contain valid price range bounds", () => {
    expect(PRICE_RANGES).toBeDefined();
    expect(PRICE_RANGES.length).toBeGreaterThan(0);
    expect(PRICE_RANGES[0].min).toBe(0);
  });

  it("should contain valid hero images dictionary", () => {
    expect(HERO_IMAGES).toBeDefined();
    expect(HERO_IMAGES.journalCollage).toContain("https://");
  });
});
