import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Icons, Breadcrumb } from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import { CATEGORIES, SORT_OPTIONS, PRICE_RANGES } from "../data";
import { PRODUCTS } from "../data/products.js";
import { useWishlist, useDocumentTitle } from "../hooks";
import { getApiUrl } from "../api/config";
import { SlidersHorizontal, X, Grid, List } from "lucide-react";

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
    const [showFilters, setShowFilters] = useState(true);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    useEffect(() => {
        setActiveCat(params.get("cat") ?? "all");
        setOnlyNew(params.get("filter") === "new");
        setOnlyBest(params.get("filter") === "bestseller");
        setOnlyWishlist(params.get("filter") === "wishlist");
        setSearchQ(params.get("q") ?? "");
    }, [params]);

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

    // Sidebar Content Component
    const SidebarFilters = () => (
        <div className="flex flex-col gap-6">
            {/* Search */}
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 color-[#9C968D]">
                    <Icons.Search />
                </span>
                <input
                    type="text"
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl text-xs py-2.5 pl-9 pr-3 text-[#23201D] placeholder-[#9C968D] outline-none focus:border-[#8192D4] transition-colors"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search products..."
                />
            </div>

            {/* Categories Accordion */}
            <div>
                <p className="text-[10.5px] font-bold text-[#9C968D] tracking-[2px] uppercase mb-3 px-1">
                    CATEGORIES
                </p>
                <div className="flex flex-col gap-0.5">
                    <button
                        onClick={() => changeCat("all")}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            activeCat === "all"
                                ? "bg-[#F4EFE6] text-[#23201D] font-bold border-l-2 border-[#8192D4]"
                                : "text-[#6E6A63] hover:bg-[#FAF7F2] hover:text-[#23201D]"
                        }`}
                    >
                        <span>All Products</span>
                        <span className="text-[11px] text-[#9C968D]">{liveProducts.length}</span>
                    </button>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => changeCat(cat.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                activeCat === cat.id
                                    ? "bg-[#F4EFE6] text-[#23201D] font-bold border-l-2 border-[#8192D4]"
                                    : "text-[#6E6A63] hover:bg-[#FAF7F2] hover:text-[#23201D]"
                            }`}
                        >
                            <span>{cat.label}</span>
                            <span className="text-[11px] text-[#9C968D]">{cat.productCount}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[1px] bg-[#EAE3D9]" />

            {/* Price Filter */}
            <div>
                <p className="text-[10.5px] font-bold text-[#9C968D] tracking-[2px] uppercase mb-3 px-1">
                    PRICE RANGE
                </p>
                <div className="flex flex-col gap-1">
                    {PRICE_RANGES.map((r, i) => (
                        <button
                            key={r.label}
                            onClick={() => setPriceRange(priceRange === i ? null : i)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                                priceRange === i
                                    ? "bg-[#F4EFE6] text-[#23201D] font-bold"
                                    : "text-[#6E6A63] hover:bg-[#FAF7F2] hover:text-[#23201D]"
                            }`}
                        >
                            <span
                                className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                                    priceRange === i
                                        ? "bg-[#23201D] border-[#23201D] text-white"
                                        : "border-[#EAE3D9] bg-white"
                                }`}
                            >
                                {priceRange === i && "✓"}
                            </span>
                            <span>{r.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[1px] bg-[#EAE3D9]" />

            {/* Other Filters */}
            <div>
                <p className="text-[10.5px] font-bold text-[#9C968D] tracking-[2px] uppercase mb-3 px-1">
                    FILTER BY
                </p>
                <div className="flex flex-col gap-1">
                    {[
                        { label: "New Arrivals", v: onlyNew, set: setOnlyNew },
                        { label: "Best Sellers", v: onlyBest, set: setOnlyBest },
                        { label: "My Wishlist", v: onlyWishlist, set: setOnlyWishlist },
                        { label: "In Stock Only", v: onlyInStock, set: setOnlyInStock },
                    ].map((f) => (
                        <label
                            key={f.label}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#6E6A63] hover:bg-[#FAF7F2] hover:text-[#23201D] cursor-pointer transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={f.v}
                                onChange={(e) => f.set(e.target.checked)}
                                className="w-4 h-4 rounded border-[#EAE3D9] text-[#23201D] focus:ring-0 cursor-pointer"
                            />
                            <span>{f.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear Filters Button */}
            {activeFilters.length > 0 && (
                <button
                    onClick={clearAll}
                    className="w-full py-2.5 rounded-xl border border-[#EAE3D9] text-xs font-semibold text-[#6E6A63] hover:bg-[#F4EFE6] hover:text-[#23201D] transition-colors cursor-pointer"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );

    return (
        <div className="bg-[#FAF7F2] min-h-screen">
            {/* 1. EDITORIAL PAGE HEADER */}
            <div className="bg-white border-b border-[#EAE3D9] py-8 md:py-10">
                <div className="container mx-auto px-4 md:px-8">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Shop", href: "/shop" },
                            ...(currentCat ? [{ label: currentCat.label }] : []),
                        ]}
                    />
                    <div className="mt-3 flex flex-col md:flex-row md:items-end justify-between gap-2">
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl font-normal text-[#23201D] tracking-tight">
                                {onlyWishlist ? "My Wishlist" : currentCat ? currentCat.label : "All Products"}
                            </h1>
                            <p className="text-xs md:text-sm text-[#78726A] mt-1 font-normal">
                                Curated aesthetic stationery & workspace essentials
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CATALOG AREA */}
            <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
                {/* TOP TOOLBAR */}
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EAE3D9] flex-wrap">
                    {/* Left: Filter Toggle & Count */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setMobileFilterOpen(true)}
                            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EAE3D9] text-xs font-semibold text-[#23201D] hover:bg-[#F4EFE6] transition-colors shadow-2xs"
                        >
                            <SlidersHorizontal size={14} />
                            <span>Filters</span>
                            {activeFilters.length > 0 && (
                                <span className="w-5 h-5 rounded-full bg-[#8192D4] text-white text-[10px] font-bold flex items-center justify-center">
                                    {activeFilters.length}
                                </span>
                            )}
                        </button>

                        {/* Desktop Filter Hide/Show Toggle */}
                        {!onlyWishlist && (
                            <button
                                onClick={() => setShowFilters((f) => !f)}
                                className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EAE3D9] text-xs font-semibold text-[#23201D] hover:bg-[#F4EFE6] transition-colors shadow-2xs"
                            >
                                <SlidersHorizontal size={14} />
                                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                            </button>
                        )}

                        <span className="text-xs text-[#78726A] font-medium">
                            {onlyWishlist
                                ? `${filtered.length} saved item${filtered.length === 1 ? "" : "s"}`
                                : `Showing ${filtered.length} of ${liveProducts.length} products`}
                        </span>
                    </div>

                    {/* Right: Sort Dropdown & Grid View Toggle */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#78726A] font-medium hidden sm:inline">Sort by:</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="bg-white border border-[#EAE3D9] rounded-xl text-xs py-2 px-3 text-[#23201D] font-medium outline-none focus:border-[#8192D4] cursor-pointer"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Grid View Icons */}
                        <div className="hidden sm:flex border border-[#EAE3D9] bg-white rounded-xl overflow-hidden p-0.5">
                            <button
                                onClick={() => setGridView(3)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    gridView === 3 ? "bg-[#23201D] text-white" : "text-[#78726A] hover:text-[#23201D]"
                                }`}
                                title="3 Columns"
                            >
                                <Grid size={15} />
                            </button>
                            <button
                                onClick={() => setGridView(4)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    gridView === 4 ? "bg-[#23201D] text-white" : "text-[#78726A] hover:text-[#23201D]"
                                }`}
                                title="4 Columns"
                            >
                                <List size={15} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ACTIVE FILTER PILLS */}
                {activeFilters.length > 0 && (
                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                        <span className="text-xs font-semibold text-[#78726A]">Active Filters:</span>
                        {activeFilters.map((f, i) => (
                            <span
                                key={i}
                                className="bg-white border border-[#EAE3D9] text-xs text-[#23201D] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs"
                            >
                                {f.label}
                                <button
                                    onClick={f.clear}
                                    className="hover:text-[#D97762] transition-colors cursor-pointer"
                                    title="Remove filter"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={clearAll}
                            className="text-xs text-[#8192D4] font-semibold hover:underline cursor-pointer ml-1"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* 3. CONTENT GRID & SIDEBAR */}
                <div
                    className={`grid gap-8 items-start ${
                        showFilters && !onlyWishlist ? "grid-cols-1 lg:grid-cols-[240px_1fr]" : "grid-cols-1"
                    }`}
                >
                    {/* DESKTOP SIDEBAR */}
                    {showFilters && !onlyWishlist && (
                        <aside className="hidden lg:block sticky top-24 bg-white p-5 rounded-2xl border border-[#EAE3D9]">
                            <SidebarFilters />
                        </aside>
                    )}

                    {/* PRODUCT GRID */}
                    <div>
                        {filtered.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE3D9] my-4">
                                <div className="text-4xl mb-3 opacity-30">🔍</div>
                                <h3 className="text-lg font-bold text-[#23201D] mb-1">No products match your selection</h3>
                                <p className="text-xs text-[#78726A] mb-6">Try adjusting your filters or search keywords</p>
                                <button
                                    onClick={clearAll}
                                    className="px-5 py-2.5 rounded-xl bg-[#23201D] text-white text-xs font-semibold hover:bg-[#35312D] transition-colors cursor-pointer"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div
                                className={`grid grid-cols-2 gap-3.5 sm:gap-5 ${
                                    gridView === 3
                                        ? "md:grid-cols-3"
                                        : "md:grid-cols-3 xl:grid-cols-4"
                                }`}
                            >
                                {filtered.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
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

