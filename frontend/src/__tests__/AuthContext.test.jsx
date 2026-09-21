import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";

describe("AuthContext State & Operations Tests", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should throw error if useAuth is used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow();
  });

  it("should initialize with null user and null token", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.isAdmin).toBe(false);
  });

  it("should handle login network failure gracefully", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    let res;
    await act(async () => {
      res = await result.current.login("test@example.com", "password123");
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain("Network Error");
  });
});
