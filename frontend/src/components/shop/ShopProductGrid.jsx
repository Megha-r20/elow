import { ProductCard } from "../ProductCard";

export function ShopProductGrid({
    filtered,
    visibleProducts,
    visibleCount,
    setVisibleCount,
    gridView,
    clearAll,
}) {
    if (filtered.length === 0) {
        return (
            <div
                style={{
                    background: "#FFFFFF",
                    borderRadius: 20,
                    padding: 48,
                    textAlign: "center",
                    border: "1px solid #EAE3D9",
                }}
            >
                <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>🔍</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#23201D", marginBottom: 4 }}>
                    No products match your selection
                </h3>
                <p style={{ fontSize: 13, color: "#78726A", marginBottom: 24 }}>
                    Try adjusting your filters or search keywords
                </p>
                <button
                    onClick={clearAll}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 12,
                        background: "#23201D",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Clear all filters
                </button>
            </div>
        );
    }

    return (
        <div>
            <div
                className={`grid gap-4 sm:gap-6 ${
                    gridView === 3
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                }`}
            >
                {visibleProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>

            {/* VIEW MORE PRODUCTS BUTTON */}
            {visibleCount < filtered.length && (
                <div
                    style={{
                        marginTop: 52,
                        marginBottom: 12,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 14,
                    }}
                >
                    <p style={{ fontSize: 13, color: "#78726A", fontWeight: 500, margin: 0 }}>
                        Showing <strong style={{ color: "#23201D" }}>{visibleProducts.length}</strong> of{" "}
                        <strong style={{ color: "#23201D" }}>{filtered.length}</strong> products
                    </p>
                    <div style={{ width: 220, height: 4, background: "#EAE3D9", borderRadius: 999, overflow: "hidden" }}>
                        <div
                            style={{
                                width: `${(visibleProducts.length / filtered.length) * 100}%`,
                                height: "100%",
                                background: "#23201D",
                                borderRadius: 999,
                                transition: "width 0.4s ease",
                            }}
                        />
                    </div>
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 12)}
                        style={{
                            marginTop: 6,
                            padding: "13px 36px",
                            borderRadius: 30,
                            background: "#FFFFFF",
                            color: "#23201D",
                            fontSize: 13,
                            fontWeight: 600,
                            border: "1.5px solid #23201D",
                            cursor: "pointer",
                            boxShadow: "0 2px 10px rgba(35, 32, 29, 0.05)",
                            transition: "all 0.2s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                        className="hover:bg-[#23201D] hover:text-white active:scale-[0.98]"
                    >
                        <span>View More Products</span>
                        <span
                            style={{
                                fontSize: 11,
                                background: "rgba(35, 32, 29, 0.08)",
                                padding: "2px 8px",
                                borderRadius: 10,
                            }}
                        >
                            +{Math.min(12, filtered.length - visibleCount)}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
