import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { SectionHead, Icons, Breadcrumb } from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS, CATEGORIES, SORT_OPTIONS, PRICE_RANGES } from "../data";
import { useWishlist } from "../hooks";

const T = {
  border: "#EDE8E1", txt: "#1C1C1A", muted: "#5C5C58", light: "#8C8880",
  sand: "#F5F0E8", cream: "#FAFAF7", teal: "#3dbdb5",
};

export default function Shop() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const wishlist   = useWishlist();

  const initCat = params.get("cat") ?? "all";
  const initQ   = params.get("q") ?? "";

  const [activeCat,    setActiveCat]    = useState(initCat);
  const [sort,         setSort]         = useState("featured");
  const [priceRange,   setPriceRange]   = useState<number | null>(null);
  const [onlyInStock,  setOnlyInStock]  = useState(false);
  const [onlyNew,      setOnlyNew]      = useState(params.get("filter") === "new");
  const [onlyBest,     setOnlyBest]     = useState(params.get("filter") === "bestseller");
  const [onlyWishlist, setOnlyWishlist] = useState(params.get("filter") === "wishlist");
  const [searchQ,      setSearchQ]      = useState(initQ);
  const [gridView,     setGridView]     = useState<3 | 4>(4);
  const [showFilters,  setShowFilters]  = useState(true);

  useEffect(() => {
    setActiveCat(params.get("cat") ?? "all");
    setOnlyNew(params.get("filter") === "new");
    setOnlyBest(params.get("filter") === "bestseller");
    setOnlyWishlist(params.get("filter") === "wishlist");
    setSearchQ(params.get("q") ?? "");
  }, [params]);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    // Category
    if (activeCat !== "all") list = list.filter(p => p.category === activeCat);

    // Search
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.subcategory.toLowerCase().includes(q)
      );
    }

    // Filters
    if (onlyInStock) list = list.filter(p => p.inStock);
    if (onlyNew)     list = list.filter(p => p.isNew);
    if (onlyBest)    list = list.filter(p => p.isBestseller);
    if (onlyWishlist)list = list.filter(p => wishlist.has(p.id));

    // Price range
    if (priceRange !== null) {
      const r = PRICE_RANGES[priceRange];
      list = list.filter(p => p.price >= r.min && p.price <= r.max);
    }

    // Sort
    switch (sort) {
      case "price-asc":   list.sort((a, b) => a.price - b.price); break;
      case "price-desc":  list.sort((a, b) => b.price - a.price); break;
      case "rating":      list.sort((a, b) => b.rating - a.rating); break;
      case "newest":      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case "bestselling": list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)); break;
    }

    return list;
  }, [activeCat, sort, priceRange, onlyInStock, onlyNew, onlyBest, onlyWishlist, searchQ, wishlist.ids]);

  const activeFilters = [
    ...(activeCat !== "all" ? [{ label: CATEGORIES.find(c => c.id === activeCat)?.label ?? activeCat, clear: () => setActiveCat("all") }] : []),
    ...(onlyNew      ? [{ label: "New Arrivals",  clear: () => setOnlyNew(false)      }] : []),
    ...(onlyBest     ? [{ label: "Best Sellers",  clear: () => setOnlyBest(false)     }] : []),
    ...(onlyWishlist ? [{ label: "My Wishlist",   clear: () => setOnlyWishlist(false) }] : []),
    ...(onlyInStock  ? [{ label: "In Stock",      clear: () => setOnlyInStock(false)  }] : []),
    ...(priceRange !== null ? [{ label: PRICE_RANGES[priceRange].label, clear: () => setPriceRange(null) }] : []),
    ...(searchQ ? [{ label: `"${searchQ}"`, clear: () => setSearchQ("") }] : []),
  ];

  const clearAll = () => { setActiveCat("all"); setOnlyNew(false); setOnlyBest(false); setOnlyWishlist(false); setOnlyInStock(false); setPriceRange(null); setSearchQ(""); };

  const currentCat = CATEGORIES.find(c => c.id === activeCat);

  return (
    <div style={{ background: T.cream, minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, padding: "28px 0" }}>
        <div className="container">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(currentCat ? [{ label: currentCat.label }] : []),
          ]} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="font-display" style={{ fontSize: 36, fontWeight: 400, color: T.txt, letterSpacing: "-0.3px" }}>
                {onlyWishlist ? "My Wishlist" : currentCat ? currentCat.label : "All Products"}
              </h1>
              <p style={{ fontSize: 13.5, color: T.light, marginTop: 4 }}>{filtered.length} products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: showFilters ? "240px 1fr" : "1fr", gap: 32, alignItems: "start" }}>
          {/* ── Sidebar filters ───────────────────────────────── */}
          {showFilters && (
            <aside style={{ position: "sticky", top: 90 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
                {/* Search */}
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.light }}>
                    <Icons.Search />
                  </span>
                  <input
                    className="field field-sm"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search products..."
                    style={{ paddingLeft: 38, width: "100%", background: "#fff" }}
                  />
                </div>
                {/* Sort */}
                <select className="field field-sm" value={sort} onChange={e => setSort(e.target.value)} style={{ width: "100%", background: "#fff" }}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                {/* Categories */}
                <div style={{ padding: "20px 20px 0" }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: T.light, letterSpacing: "2px", marginBottom: 14 }}>CATEGORIES</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button onClick={() => setActiveCat("all")} style={{ textAlign: "left", background: activeCat === "all" ? T.sand : "transparent", border: "none", borderRadius: 9, padding: "9px 12px", fontSize: 13.5, fontWeight: activeCat === "all" ? 700 : 500, color: T.txt, cursor: "pointer", fontFamily: "inherit", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.14s" }}>
                      <span>All Products</span>
                      <span style={{ fontSize: 11.5, color: T.light }}>{PRODUCTS.length}</span>
                    </button>
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ textAlign: "left", background: activeCat === cat.id ? T.sand : "transparent", border: "none", borderRadius: 9, padding: "9px 12px", fontSize: 13.5, fontWeight: activeCat === cat.id ? 700 : 500, color: activeCat === cat.id ? T.txt : T.muted, cursor: "pointer", fontFamily: "inherit", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.14s" }}>
                        <span>{cat.label}</span>
                        <span style={{ fontSize: 11.5, color: T.light }}>{cat.productCount}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ height: 1, background: T.border, margin: "16px 0" }} />

                {/* Price range */}
                <div style={{ padding: "0 20px" }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: T.light, letterSpacing: "2px", marginBottom: 14 }}>PRICE</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {PRICE_RANGES.map((r, i) => (
                      <button key={r.label} onClick={() => setPriceRange(priceRange === i ? null : i)} style={{ textAlign: "left", background: priceRange === i ? T.sand : "transparent", border: "none", borderRadius: 9, padding: "9px 12px", fontSize: 13.5, fontWeight: priceRange === i ? 700 : 500, color: priceRange === i ? T.txt : T.muted, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 9, transition: "background 0.14s" }}>
                        <span style={{ width: 15, height: 15, borderRadius: 4, border: `1.5px solid ${priceRange === i ? "#1C1C1A" : T.border}`, background: priceRange === i ? "#1C1C1A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.14s" }}>
                          {priceRange === i && <span style={{ color: "#fff", fontSize: 9 }}>✓</span>}
                        </span>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ height: 1, background: T.border, margin: "16px 0" }} />

                {/* Other filters */}
                <div style={{ padding: "0 20px 20px" }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: T.light, letterSpacing: "2px", marginBottom: 14 }}>FILTER BY</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {[
                      { label: "New Arrivals",  v: onlyNew,      set: setOnlyNew      },
                      { label: "Best Sellers",  v: onlyBest,     set: setOnlyBest     },
                      { label: "My Wishlist",   v: onlyWishlist, set: setOnlyWishlist },
                      { label: "In Stock Only", v: onlyInStock,  set: setOnlyInStock  },
                    ].map(f => (
                      <label key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer", borderRadius: 9, transition: "background 0.14s", fontSize: 13.5, fontWeight: f.v ? 700 : 500, color: f.v ? T.txt : T.muted }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = T.sand)}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      >
                        <input type="checkbox" checked={f.v} onChange={e => f.set(e.target.checked)} className="checkbox" />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear all filters */}
              {activeFilters.length > 0 && (
                <button onClick={clearAll} className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 12 }}>
                  Clear all filters
                </button>
              )}
            </aside>
          )}

          {/* ── Product grid ─────────────────────────────────────── */}
          <div>
            {/* Toggle sidebar + count + grid view */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => setShowFilters(f => !f)} className="btn btn-ghost btn-sm" style={{ gap: 7 }}>
                  <Icons.Filter />
                  {showFilters ? "Hide" : "Show"} Filters
                </button>
                <p style={{ fontSize: 13, color: T.light, fontWeight: 500 }}>
                  Showing {filtered.length} of {PRODUCTS.length} products
                </p>
              </div>
              {/* Grid view toggle */}
              <div style={{ display: "flex", border: `1.5px solid ${T.border}`, borderRadius: 9, overflow: "hidden" }}>
                {([3, 4] as const).map(n => (
                  <button key={n} onClick={() => setGridView(n)} style={{ width: 34, height: 34, border: "none", cursor: "pointer", background: gridView === n ? "#1C1C1A" : "#fff", color: gridView === n ? "#fff" : T.muted, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.14s", fontSize: 11, fontWeight: 700 }}>
                    {n === 3 ? "III" : "IIII"}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 20, padding: "80px 40px", textAlign: "center", border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>🔍</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.txt, marginBottom: 8 }}>No products found</h3>
                <p style={{ fontSize: 14, color: T.light, marginBottom: 24 }}>Try adjusting your filters or search term</p>
                <button onClick={clearAll} className="btn btn-dark btn-md">Clear all filters</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridView}, 1fr)`, gap: 18 }}>
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
