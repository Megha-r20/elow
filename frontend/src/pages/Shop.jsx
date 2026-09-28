import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { CATEGORIES, PRICE_RANGES } from "../data";
import { PRODUCTS } from "../data/products.js";
import { useWishlist, useDocumentTitle } from "../hooks";
import { getApiUrl } from "../api/config";
import {
    ShopFilters,
    ShopHeader,
    ShopActiveFilters,
    ShopProductGrid,
    ShopMobileDrawer,
} from "../components/shop";

export default function Shop() {
    useDocumentTitle("Shop Catalog | Elow");
    const [params, setParams] = useSearchParams();
    const wishlist = useWishlist();

    const initCat = params.get("cat") ?? "all";
    const initQ = params.get("q") ?? "";

    const [activeCat, setActiveCat] = useState(initCat);
    const [sort, setSort] = useState("featured");
    const [priceRange, setPriceRange] = useState(() => {
        const mPrice = params.get("maxPrice");
        if (mPrice === "299") return 0;
        return null;
    });
    const [maxPrice, setMaxPrice] = useState(() => params.get("maxPrice"));
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [onlyNew, setOnlyNew] = useState(params.get("filter") === "new");
    const [onlyBest, setOnlyBest] = useState(params.get("filter") === "bestseller");
    const [onlyWishlist, setOnlyWishlist] = useState(params.get("filter") === "wishlist");
    const [onlyStudents, setOnlyStudents] = useState(params.get("filter") === "students");
    const [searchQ, setSearchQ] = useState(initQ);
    const [gridView, setGridView] = useState(3);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        setActiveCat(params.get("cat") ?? "all");
        setOnlyNew(params.get("filter") === "new");
        setOnlyBest(params.get("filter") === "bestseller");
        setOnlyWishlist(params.get("filter") === "wishlist");
        setOnlyStudents(params.get("filter") === "students");
        setSearchQ(params.get("q") ?? "");

        const mPrice = params.get("maxPrice");
        setMaxPrice(mPrice);
        if (mPrice === "299") {
            setPriceRange(0);
        } else if (!mPrice) {
            setPriceRange(null);
        }
    }, [params]);

    const updateParam = (key, value) => {
        const newParams = new URLSearchParams(params);
        if (value === null || value === undefined || value === "") {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }
        setParams(newParams);
    };

    useEffect(() => {
        setVisibleCount(12);
    }, [activeCat, sort, priceRange, maxPrice, onlyInStock, onlyNew, onlyBest, onlyWishlist, onlyStudents, searchQ]);

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
        if (onlyStudents) {
            list = list.filter(
                (p) =>
                    p.category === "planners" ||
                    (p.tags && p.tags.some((t) => t.toLowerCase().includes("student") || t.toLowerCase().includes("study") || t.toLowerCase().includes("planner"))) ||
                    p.name.toLowerCase().includes("student") ||
                    p.description.toLowerCase().includes("student") ||
                    p.description.toLowerCase().includes("study")
            );
        }
        // Price range
        if (priceRange !== null) {
            const r = PRICE_RANGES[priceRange];
            list = list.filter((p) => p.price >= r.min && p.price <= r.max);
        } else if (maxPrice) {
            const numMax = Number(maxPrice);
            if (!isNaN(numMax)) {
                list = list.filter((p) => p.price <= numMax);
            }
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
            case "featured":
            default:
                if (activeCat === "all") {
                    list.sort((a, b) => {
                        const aPlanner = a.category === "planners" ? 1 : 0;
                        const bPlanner = b.category === "planners" ? 1 : 0;
                        return bPlanner - aPlanner;
                    });
                }
                break;
        }
        return list;
    }, [activeCat, sort, priceRange, maxPrice, onlyInStock, onlyNew, onlyBest, onlyWishlist, onlyStudents, searchQ, wishlist.ids, liveProducts]);

    const visibleProducts = useMemo(() => {
        return filtered.slice(0, visibleCount);
    }, [filtered, visibleCount]);

    const activeFilters = [
        ...(activeCat !== "all" ? [{ label: CATEGORIES.find((c) => c.id === activeCat)?.label ?? activeCat, clear: () => changeCat("all") }] : []),
        ...(onlyNew ? [{ label: "New Arrivals", clear: () => updateParam("filter", null) }] : []),
        ...(onlyBest ? [{ label: "Best Sellers", clear: () => updateParam("filter", null) }] : []),
        ...(onlyWishlist ? [{ label: "My Wishlist", clear: () => updateParam("filter", null) }] : []),
        ...(onlyStudents ? [{ label: "For Students", clear: () => updateParam("filter", null) }] : []),
        ...(onlyInStock ? [{ label: "In Stock", clear: () => setOnlyInStock(false) }] : []),
        ...(priceRange !== null ? [{ label: PRICE_RANGES[priceRange].label, clear: () => { setPriceRange(null); updateParam("maxPrice", null); } }] : []),
        ...(maxPrice && priceRange === null ? [{ label: `Under ₹${maxPrice}`, clear: () => updateParam("maxPrice", null) }] : []),
        ...(searchQ ? [{ label: `"${searchQ}"`, clear: () => updateParam("q", null) }] : []),
    ];

    const clearAll = () => {
        setActiveCat("all");
        setOnlyNew(false);
        setOnlyBest(false);
        setOnlyWishlist(false);
        setOnlyStudents(false);
        setOnlyInStock(false);
        setPriceRange(null);
        setMaxPrice(null);
        setSearchQ("");
        setParams(new URLSearchParams());
    };

    const currentCat = CATEGORIES.find((c) => c.id === activeCat);

    const filterProps = {
        searchQ,
        setSearchQ,
        activeCat,
        changeCat,
        liveProductsCount: liveProducts.length,
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
        activeFiltersCount: activeFilters.length,
        clearAll,
    };

    return (
        <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
            {/* 1. EDITORIAL PAGE HEADER */}
            <ShopHeader
                currentCat={currentCat}
                onlyWishlist={onlyWishlist}
                filteredCount={filtered.length}
                totalCount={liveProducts.length}
                setMobileFilterOpen={setMobileFilterOpen}
                activeFiltersCount={activeFilters.length}
                sort={sort}
                setSort={setSort}
                gridView={gridView}
                setGridView={setGridView}
            />

            {/* 2. MAIN CATALOG AREA */}
            <div className="container mx-auto px-4 md:px-8 pt-6 pb-20 md:pb-28">
                {/* ACTIVE FILTER PILLS */}
                <ShopActiveFilters activeFilters={activeFilters} clearAll={clearAll} />

                {/* 3. CONTENT GRID & SIDEBAR */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: !onlyWishlist ? "270px 1fr" : "1fr",
                        gap: 32,
                        alignItems: "start",
                    }}
                >
                    {/* DESKTOP SIDEBAR */}
                    {!onlyWishlist && (
                        <aside
                            className="hidden lg:block"
                            style={{
                                sticky: "top 100px",
                                background: "#FFFFFF",
                                padding: 20,
                                borderRadius: 20,
                                border: "1px solid #EAE3D9",
                                boxShadow: "0 4px 20px rgba(35, 32, 29, 0.03)",
                            }}
                        >
                            <ShopFilters {...filterProps} />
                        </aside>
                    )}

                    {/* PRODUCT GRID */}
                    <ShopProductGrid
                        filtered={filtered}
                        visibleProducts={visibleProducts}
                        visibleCount={visibleCount}
                        setVisibleCount={setVisibleCount}
                        gridView={gridView}
                        clearAll={clearAll}
                    />
                </div>
            </div>

            {/* 4. MOBILE FILTER DRAWER MODAL */}
            <ShopMobileDrawer
                isOpen={mobileFilterOpen}
                onClose={() => setMobileFilterOpen(false)}
                filteredCount={filtered.length}
                filterProps={filterProps}
            />
        </div>
    );
}
