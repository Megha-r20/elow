import { describe, it, expect } from "vitest";
import { getApiUrl, API_BASE_URL } from "../api/config";

describe("Frontend API Config Helper Tests", () => {
  it("should return valid base URL string", () => {
    expect(typeof API_BASE_URL).toBe("string");
  });

  it("should format API endpoint URLs correctly", () => {
    const url1 = getApiUrl("/api/products");
    expect(url1).toContain("/api/products");

    const url2 = getApiUrl("api/auth/login");
    expect(url2).toContain("/api/auth/login");
  });
});
