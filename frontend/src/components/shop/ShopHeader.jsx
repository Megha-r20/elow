import { SlidersHorizontal, Grid, LayoutGrid } from "lucide-react";
import { Breadcrumb } from "../ui";
import { SORT_OPTIONS } from "../../data";

export function ShopHeader({
    currentCat,
    onlyWishlist,
    filteredCount,
    totalCount,
    setMobileFilterOpen,
    activeFiltersCount,
    sort,
    setSort,
    gridView,
    setGridView,
}) {
    return (
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
                        <h1
                            className="font-display"
                            style={{
                                fontSize: 38,
                                fontWeight: 400,
                                color: "#23201D",
                                letterSpacing: "-0.5px",
                                margin: 0,
                                lineHeight: 1.1,
                            }}
                        >
                            {onlyWishlist ? "My Wishlist" : currentCat ? currentCat.label : "All Products"}
                        </h1>
                        <span
                            style={{
                                fontSize: 13,
                                color: "#9C968D",
                                fontWeight: 500,
                                background: "#FFFFFF",
                                border: "1px solid #EAE3D9",
                                padding: "2px 10px",
                                borderRadius: 20,
                            }}
                        >
                            {filteredCount} {filteredCount === 1 ? "item" : "items"}
                        </span>
                    </div>
                    <p style={{ fontSize: 14, color: "#78726A", margin: 0 }}>
                        Curated aesthetic stationery & workspace essentials
                    </p>
                </div>

                {/* TOP TOOLBAR INSIDE HEADER */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                        marginTop: 24,
                        flexWrap: "wrap",
                    }}
                >
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
                                {activeFiltersCount > 0 && (
                                    <span
                                        style={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: "50%",
                                            background: "#23201D",
                                            color: "#FFFFFF",
                                            fontSize: 10,
                                            fontWeight: 700,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        )}

                        <span style={{ fontSize: 13, color: "#78726A", fontWeight: 500 }} className="hidden sm:inline">
                            {onlyWishlist
                                ? `Showing ${filteredCount} saved item${filteredCount === 1 ? "" : "s"}`
                                : `Showing ${filteredCount} of ${totalCount} products`}
                        </span>
                    </div>

                    {/* Right: Sort Dropdown & Grid View Switcher */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: "#78726A", fontWeight: 500 }} className="hidden sm:inline">
                                Sort by:
                            </span>
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
                        <div
                            className="hidden sm:flex"
                            style={{
                                border: "1px solid #EAE3D9",
                                background: "#FFFFFF",
                                borderRadius: 12,
                                overflow: "hidden",
                                padding: 3,
                                boxShadow: "0 2px 8px rgba(35, 32, 29, 0.03)",
                            }}
                        >
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
    );
}
