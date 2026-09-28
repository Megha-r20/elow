import { Icons } from "../ui";
import { CATEGORIES, PRICE_RANGES } from "../../data";

export function ShopFilters({
    searchQ,
    setSearchQ,
    activeCat,
    changeCat,
    liveProductsCount,
    priceRange,
    setPriceRange,
    onlyNew,
    setOnlyNew,
    onlyBest,
    setOnlyBest,
    onlyWishlist,
    setOnlyWishlist,
    onlyInStock,
    setOnlyInStock,
    activeFiltersCount,
    clearAll,
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Search Input */}
            <div style={{ position: "relative", width: "100%" }}>
                <span
                    style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9C968D",
                        pointerEvents: "none",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Icons.Search />
                </span>
                <input
                    type="text"
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        paddingLeft: 40,
                        paddingRight: 14,
                        paddingTop: 10,
                        paddingBottom: 10,
                        background: "#FAF7F2",
                        border: "1px solid #EAE3D9",
                        borderRadius: 12,
                        fontSize: 13,
                        color: "#23201D",
                        outline: "none",
                        fontFamily: "inherit",
                    }}
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search products..."
                />
            </div>

            {/* Categories */}
            <div>
                <p
                    style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#9C968D",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        marginBottom: 12,
                        paddingLeft: 4,
                    }}
                >
                    CATEGORIES
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <button
                        onClick={() => changeCat("all")}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: 10,
                            border: "none",
                            background: activeCat === "all" ? "#F4EFE6" : "transparent",
                            color: activeCat === "all" ? "#23201D" : "#6E6A63",
                            fontWeight: activeCat === "all" ? 700 : 500,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            fontFamily: "inherit",
                        }}
                    >
                        <span
                            style={{
                                flex: 1,
                                textAlign: "left",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginRight: 8,
                            }}
                        >
                            All Products
                        </span>
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#9C968D",
                                background: "#FAF7F2",
                                border: "1px solid #EAE3D9",
                                borderRadius: 10,
                                padding: "1px 7px",
                                fontFamily: "monospace",
                                flexShrink: 0,
                            }}
                        >
                            {liveProductsCount}
                        </span>
                    </button>

                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => changeCat(cat.id)}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                padding: "9px 12px",
                                borderRadius: 10,
                                border: "none",
                                background: activeCat === cat.id ? "#F4EFE6" : "transparent",
                                color: activeCat === cat.id ? "#23201D" : "#6E6A63",
                                fontWeight: activeCat === cat.id ? 700 : 500,
                                fontSize: 13,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                fontFamily: "inherit",
                            }}
                        >
                            <span
                                style={{
                                    flex: 1,
                                    textAlign: "left",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    marginRight: 8,
                                }}
                            >
                                {cat.label}
                            </span>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#9C968D",
                                    background: "#FAF7F2",
                                    border: "1px solid #EAE3D9",
                                    borderRadius: 10,
                                    padding: "1px 7px",
                                    fontFamily: "monospace",
                                    flexShrink: 0,
                                }}
                            >
                                {cat.productCount}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ height: 1, background: "#EAE3D9" }} />

            {/* Price Range */}
            <div>
                <p
                    style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#9C968D",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        marginBottom: 12,
                        paddingLeft: 4,
                    }}
                >
                    PRICE RANGE
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {PRICE_RANGES.map((r, i) => (
                        <button
                            key={r.label}
                            onClick={() => setPriceRange(priceRange === i ? null : i)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: 10,
                                border: "none",
                                background: priceRange === i ? "#F4EFE6" : "transparent",
                                color: priceRange === i ? "#23201D" : "#6E6A63",
                                fontWeight: priceRange === i ? 700 : 500,
                                fontSize: 13,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                fontFamily: "inherit",
                            }}
                        >
                            <span
                                style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: 4,
                                    border: priceRange === i ? "1.5px solid #23201D" : "1.5px solid #EAE3D9",
                                    background: priceRange === i ? "#23201D" : "#FFFFFF",
                                    color: "#FFFFFF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                {priceRange === i && "✓"}
                            </span>
                            <span>{r.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ height: 1, background: "#EAE3D9" }} />

            {/* Filter By */}
            <div>
                <p
                    style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#9C968D",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        marginBottom: 12,
                        paddingLeft: 4,
                    }}
                >
                    FILTER BY
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {[
                        { label: "New Arrivals", v: onlyNew, set: setOnlyNew },
                        { label: "Best Sellers", v: onlyBest, set: setOnlyBest },
                        { label: "My Wishlist", v: onlyWishlist, set: setOnlyWishlist },
                        { label: "In Stock Only", v: onlyInStock, set: setOnlyInStock },
                    ].map((f) => (
                        <label
                            key={f.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "8px 12px",
                                borderRadius: 10,
                                fontSize: 13,
                                color: "#6E6A63",
                                fontWeight: f.v ? 700 : 500,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={f.v}
                                onChange={(e) => f.set(e.target.checked)}
                                style={{ width: 16, height: 16, accentColor: "#23201D", cursor: "pointer", flexShrink: 0 }}
                            />
                            <span>{f.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear All Button */}
            {activeFiltersCount > 0 && (
                <button
                    onClick={clearAll}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 12,
                        border: "1px solid #EAE3D9",
                        background: "#FAF7F2",
                        color: "#6E6A63",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
}
