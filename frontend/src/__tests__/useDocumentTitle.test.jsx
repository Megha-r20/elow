import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

describe("useDocumentTitle Hook Tests", () => {
  let initialTitle;

  beforeEach(() => {
    initialTitle = document.title;
  });

  afterEach(() => {
    document.title = initialTitle;
  });

  it("should update document title with app suffix on render", () => {
    renderHook(() => useDocumentTitle("Shop"));
    expect(document.title).toBe("Shop — elow");
  });

  it("should restore previous document title on unmount", () => {
    document.title = "Original Title";
    const { unmount } = renderHook(() => useDocumentTitle("Checkout"));
    expect(document.title).toBe("Checkout — elow");

    unmount();
    expect(document.title).toBe("Original Title");
  });
});
