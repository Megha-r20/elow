import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Icons, Breadcrumb } from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import { CATEGORIES, SORT_OPTIONS, PRICE_RANGES } from "../data";
import { PRODUCTS } from "../data/products.js";
import { useWishlist, useDocumentTitle } from "../hooks";
import { getApiUrl } from "../api/config";
import { SlidersHorizontal, X, Grid, LayoutGrid } from "lucide-react";

export default function Shop() {
    useDocumentTitle("Shop Catalog | Elow");
    const [params, setParams] = useSearchParams();
    const wishlist = useWishlist();

    const initCat = params.get("cat") ?? "all";
    const initQ = params.get("q") ?? "";

    const [activeCat, setActiveCat] = useState(initCat);
    const [sort, setSort] = useState("featured");
    const [priceRange, setPriceRange] = useState(null);
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [onlyNew, setOnlyNew] = useState(params.get("filter") === "new");
    const [onlyBest, setOnlyBest] = useState(params.get("filter") === "bestseller");
    const [onlyWishlist, setOnlyWishlist] = useState(params.get("filter") === "wishlist");
    const [searchQ, setSearchQ] = useState(initQ);
    const [gridView, setGridView] = useState(4);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        setActiveCat(params.get("cat") ?? "all");
        setOnlyNew(params.get("filter") === "new");
        setOnlyBest(params.get("filter") === "bestseller");
        setOnlyWishlist(params.get("filter") === "wishlist");
        setSearchQ(params.get("q") ?? "");
    }, [params]);

    useEffect(() => {
        setVisibleCount(12);
    }, [activeCat, sort, priceRange, onlyInStock, onlyNew, onlyBest, onlyWishlist, searchQ]);

    const [liveProducts, setLiveProducts] = useState(PRODUCTS);

    useEffect(() => {
        async function fetchLiveProducts() {
            try {
                const res = await fetch(getApiUrl("/api/products?limit=all"));
                if (res.ok) {
                    const data = await res.json();
                    if (data.products && data.products.length > 0) {
                        setLiveProducts(data.products);
                    }
                }
            } catch (_err) {
                /* ignore fetch error */
            }
        }
        fetchLiveProducts();
    }, []);

    const changeCat = (catId) => {
        setActiveCat(catId);
        const newParams = new URLSearchParams(params);
        if (catId === "all") newParams.delete("cat");
        else newParams.set("cat", catId);
        setParams(newParams);
    };

    const filtered = useMemo(() => {
        let list = [...liveProducts];
        // Category
        if (activeCat !== "all") list = list.filter((p) => p.category === activeCat);
        // Search
        if (searchQ.trim()) {
            const q = searchQ.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
                    (p.subcategory && p.subcategory.toLowerCase().includes(q))
            );
        }
        // Filters
        if (onlyInStock) list = list.filter((p) => p.inStock);
        if (onlyNew) list = list.filter((p) => p.isNew);
        if (onlyBest) list = list.filter((p) => p.isBestseller);
        if (onlyWishlist) list = list.filter((p) => wishlist.has(p.id));
        // Price range
        if (priceRange !== null) {
            const r = PRICE_RANGES[priceRange];
            list = list.filter((p) => p.price >= r.min && p.price <= r.max);
        }
        // Sort
        switch (sort) {
            case "price-asc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                list.sort((a, b) => b.rating - a.rating);
                break;
            case "newest":
                list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case "bestselling":
                list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
                break;
        }
        return list;
    }, [activeCat, sort, priceRange, onlyInStock, onlyNew, onlyBest, onlyWishlist, searchQ, wishlist.ids, liveProducts]);

    const visibleProducts = useMemo(() => {
        return filtered.slice(0, visibleCount);
    }, [filtered, visibleCount]);

    const activeFilters = [
        ...(activeCat !== "all" ? [{ label: CATEGORIES.find((c) => c.id === activeCat)?.label ?? activeCat, clear: () => changeCat("all") }] : []),
        ...(onlyNew ? [{ label: "New Arrivals", clear: () => setOnlyNew(false) }] : []),
        ...(onlyBest ? [{ label: "Best Sellers", clear: () => setOnlyBest(false) }] : []),
        ...(onlyWishlist ? [{ label: "My Wishlist", clear: () => setOnlyWishlist(false) }] : []),
        ...(onlyInStock ? [{ label: "In Stock", clear: () => setOnlyInStock(false) }] : []),
        ...(priceRange !== null ? [{ label: PRICE_RANGES[priceRange].label, clear: () => setPriceRange(null) }] : []),
        ...(searchQ ? [{ label: `"${searchQ}"`, clear: () => setSearchQ("") }] : []),
    ];

    const clearAll = () => {
        changeCat("all");
        setOnlyNew(false);
        setOnlyBest(false);
        setOnlyWishlist(false);
        setOnlyInStock(false);
        setPriceRange(null);
        setSearchQ("");
    };

    const currentCat = CATEGORIES.find((c) => c.id === activeCat);

    // Sidebar Filters Component
    const SidebarFilters = () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Search Input */}
            <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9C968D", pointerEvents: "none", display: "flex", alignItems: "center" }}>
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
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9C968D", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, paddingLeft: 4 }}>
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
                        <span style={{ flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8 }}>
                            All Products
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#9C968D", background: "#FAF7F2", border: "1px solid #EAE3D9", borderRadius: 10, padding: "1px 7px", fontFamily: "monospace", flexShrink: 0 }}>
                            {liveProducts.length}
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
                            <span style={{ flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8 }}>
                                {cat.label}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#9C968D", background: "#FAF7F2", border: "1px solid #EAE3D9", borderRadius: 10, padding: "1px 7px", fontFamily: "monospace", flexShrink: 0 }}>
                                {cat.productCount}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ height: 1, background: "#EAE3D9" }} />

            {/* Price Range */}
            <div>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9C968D", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, paddingLeft: 4 }}>
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
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9C968D", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, paddingLeft: 4 }}>
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
            {activeFilters.length > 0 && (
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

    return (
        <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
            {/* 1. EDITORIAL PAGE HEADER */}
            <div style={{ background: "#FAF7F2", borderBottom: "1px solid #EAE3D9", paddingTop: 36, paddingBottom: 24 }}>
                <div className="container mx-auto px-4 md:px-8">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Shop", href: "/shop" },
                            ...(currentCat ? [{ label: currentCat.label }] : []),
                        ]}
                    />
                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                            <h1 className="font-display" style={{ fontSize: 38, fontWeight: 400, color: "#23201D", letterSpacing: "-0.5px", margin: 0, lineHeight: 1.1 }}>
                                {onlyWishlist ? "My Wishlist" : currentCat ? currentCat.label : "All Products"}
                            </h1>
                            <span style={{ fontSize: 13, color: "#9C968D", fontWeight: 500, background: "#FFFFFF", border: "1px solid #EAE3D9", padding: "2px 10px", borderRadius: 20 }}>
                                {filtered.length} {filtered.length === 1 ? "item" : "items"}
                            </span>
                        </div>
                        <p style={{ fontSize: 14, color: "#78726A", margin: 0 }}>
                            Curated aesthetic stationery & workspace essentials
                        </p>
                    </div>

                    {/* TOP TOOLBAR INSIDE HEADER */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
                        {/* Left: Product Count & Mobile/Tablet Filter Trigger */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {!onlyWishlist && (
                                <button
                                    onClick={() => setMobileFilterOpen(true)}
                                    className="lg:hidden"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "8px 16px",
                                        borderRadius: 12,
                                        background: "#FFFFFF",
                                        border: "1px solid #EAE3D9",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "#23201D",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 8px rgba(35, 32, 29, 0.04)",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <SlidersHorizontal size={14} />
                                    <span>Filter & Refine</span>
                                    {activeFilters.length > 0 && (
                                        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#23201D", color: "#FFFFFF", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {activeFilters.length}
                                        </span>
                                    )}
                                </button>
                            )}

                            <span style={{ fontSize: 13, color: "#78726A", fontWeight: 500 }} className="hidden sm:inline">
                                {onlyWishlist
                                    ? `Showing ${filtered.length} saved item${filtered.length === 1 ? "" : "s"}`
                                    : `Showing ${filtered.length} of ${liveProducts.length} products`}
                            </span>
                        </div>

                        {/* Right: Sort Dropdown & Grid View Switcher */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 12, color: "#78726A", fontWeight: 500 }} className="hidden sm:inline">Sort by:</span>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    style={{
                                        background: "#FFFFFF",
                                        border: "1px solid #EAE3D9",
                                        borderRadius: 12,
                                        fontSize: 12.5,
                                        padding: "8px 14px",
                                        color: "#23201D",
                                        fontWeight: 500,
                                        outline: "none",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 8px rgba(35, 32, 29, 0.03)",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    {SORT_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Grid View Icons */}
                            <div className="hidden sm:flex" style={{ border: "1px solid #EAE3D9", background: "#FFFFFF", borderRadius: 12, overflow: "hidden", padding: 3, boxShadow: "0 2px 8px rgba(35, 32, 29, 0.03)" }}>
                                <button
                                    onClick={() => setGridView(3)}
                                    style={{
                                        padding: "6px 8px",
                                        borderRadius: 8,
                                        border: "none",
                                        cursor: "pointer",
                                        background: gridView === 3 ? "#23201D" : "transparent",
                                        color: gridView === 3 ? "#FFFFFF" : "#78726A",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.15s ease",
                                    }}
                                    title="3 Columns"
                                >
                                    <LayoutGrid size={15} />
                                </button>
                                <button
                                    onClick={() => setGridView(4)}
                                    style={{
                                        padding: "6px 8px",
                                        borderRadius: 8,
                                        border: "none",
                                        cursor: "pointer",
                                        background: gridView === 4 ? "#23201D" : "transparent",
                                        color: gridView === 4 ? "#FFFFFF" : "#78726A",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.15s ease",
                                    }}
                                    title="4 Columns"
                                >
                                    <Grid size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CATALOG AREA */}
            <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
                {/* ACTIVE FILTER PILLS */}
                {activeFilters.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#78726A" }}>Active Filters:</span>
                        {activeFilters.map((f, i) => (
                            <span
                                key={i}
                                style={{
                                    background: "#FFFFFF",
                                    border: "1px solid #EAE3D9",
                                    fontSize: 12,
                                    color: "#23201D",
                                    fontWeight: 500,
                                    padding: "4px 12px",
                                    borderRadius: 20,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                {f.label}
                                <button
                                    onClick={f.clear}
                                    style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#9C968D", display: "flex", alignItems: "center" }}
                                    title="Remove filter"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={clearAll}
                            style={{ border: "none", background: "none", color: "#8192D4", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "underline", marginLeft: 4 }}
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* 3. CONTENT GRID & SIDEBAR */}
                <div style={{ display: "grid", gridTemplateColumns: (!onlyWishlist) ? "270px 1fr" : "1fr", gap: 32, alignItems: "start" }}>
                    {/* DESKTOP SIDEBAR */}
                    {!onlyWishlist && (
                        <aside className="hidden lg:block" style={{ sticky: "top 100px", background: "#FFFFFF", padding: 20, borderRadius: 20, border: "1px solid #EAE3D9", boxShadow: "0 4px 20px rgba(35, 32, 29, 0.03)" }}>
                            <SidebarFilters />
                        </aside>
                    )}

                    {/* PRODUCT GRID */}
                    <div>
                        {filtered.length === 0 ? (
                            <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid #EAE3D9" }}>
                                <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>🔍</div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#23201D", marginBottom: 4 }}>No products match your selection</h3>
                                <p style={{ fontSize: 13, color: "#78726A", marginBottom: 24 }}>Try adjusting your filters or search keywords</p>
                                <button
                                    onClick={clearAll}
                                    style={{ padding: "10px 20px", borderRadius: 12, background: "#23201D", color: "#FFFFFF", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div
                                    className={`grid gap-4 sm:gap-5 ${
                                        gridView === 3
                                            ? "grid-cols-2 md:grid-cols-3"
                                            : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                                    }`}
                                >
                                    {visibleProducts.map((p) => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                                </div>

                                {/* VIEW MORE PRODUCTS BUTTON */}
                                {visibleCount < filtered.length && (
                                    <div style={{ marginTop: 44, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                        <p style={{ fontSize: 13, color: "#78726A", fontWeight: 500, margin: 0 }}>
                                            Showing <strong style={{ color: "#23201D" }}>{visibleProducts.length}</strong> of <strong style={{ color: "#23201D" }}>{filtered.length}</strong> products
                                        </p>
                                        <div style={{ width: 220, height: 4, background: "#EAE3D9", borderRadius: 2, overflow: "hidden" }}>
                                            <div
                                                style={{
                                                    width: `${(visibleProducts.length / filtered.length) * 100}%`,
                                                    height: "100%",
                                                    background: "#23201D",
                                                    borderRadius: 2,
                                                    transition: "width 0.3s ease",
                                                }}
                                            />
                                        </div>
                                        <button
                                            onClick={() => setVisibleCount((prev) => prev + 12)}
                                            style={{
                                                marginTop: 6,
                                                padding: "12px 32px",
                                                borderRadius: 14,
                                                background: "#23201D",
                                                color: "#FFFFFF",
                                                fontSize: 13,
                                                fontWeight: 600,
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: "0 4px 14px rgba(35, 32, 29, 0.12)",
                                                transition: "all 0.2s ease",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                            className="hover:bg-[#35312D] active:scale-[0.98]"
                                        >
                                            <span>View More Products</span>
                                            <span style={{ fontSize: 11, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 10 }}>
                                                +{Math.min(12, filtered.length - visibleCount)}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. MOBILE FILTER DRAWER MODAL */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 z-50 flex justify-end md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileFilterOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
                        <div>
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE3D9]">
                                <h3 className="font-bold text-sm text-[#23201D] tracking-wide uppercase">
                                    Filter Products
                                </h3>
                                <button
                                    onClick={() => setMobileFilterOpen(false)}
                                    className="p-1 rounded-lg hover:bg-[#F4EFE6] text-[#23201D] cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <SidebarFilters />
                        </div>

                        <div className="pt-6 border-t border-[#EAE3D9] mt-6">
                            <button
                                onClick={() => setMobileFilterOpen(false)}
                                className="w-full py-3 rounded-xl bg-[#23201D] text-white text-xs font-semibold hover:bg-[#35312D] transition-colors cursor-pointer"
                            >
                                View {filtered.length} Products
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



