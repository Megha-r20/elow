import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getProductById, PRODUCTS, REVIEWS } from "../data";
import { useCart, useWishlist, useToast, useDrawer } from "../hooks";
import { Stars, Badge, Price, Breadcrumb, QtyStepper, Divider, Icons, SectionHead } from "../components/ui";
import { ProductCard } from "../components/ProductCard";

const T = { teal:"#3dbdb5",txt:"#1C1C1A",muted:"#5C5C58",light:"#8C8880",border:"#EDE8E1",sand:"#F5F0E8",cream:"#FAFAF7" };

export default function ProductDetail() {
  const { id }        = useParams<{ id: string }>();
  const navigate      = useNavigate();
  const product       = getProductById(id ?? "");

  const { addItem }   = useCart();
  const { has, toggle } = useWishlist();
  const { addToast }  = useToast();
  const { openCart }  = useDrawer();

  const [imgIdx,  setImgIdx]  = useState(0);
  const [qty,     setQty]     = useState(1);
  const [tab,     setTab]     = useState(0);

  if (!product) {
    return (
      <div className="container" style={{ padding: "80px 32px", textAlign: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Product not found</h2>
        <button className="btn btn-dark btn-md" onClick={() => navigate("/shop")}>Back to Shop</button>
      </div>
    );
  }

  const wished    = has(product.id);
  const reviews   = REVIEWS.filter(r => r.productId === product.id);
  const related   = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const disc      = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleAdd = () => {
    addItem(product, qty);
    addToast(`${product.shortName} added to cart`);
    openCart();
  };

  return (
    <div style={{ background: T.cream, minHeight: "100vh" }}>
      <div className="container" style={{ padding: "32px 32px 64px" }}>
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.subcategory, href: `/shop?cat=${product.category}` },
          { label: product.shortName },
        ]} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start", background: "#fff", borderRadius: 24, padding: "40px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          {/* ── Image gallery ──────────────────────────────────── */}
          <div>
            {/* Main image */}
            <div style={{ borderRadius: 20, overflow: "hidden", background: T.sand, aspectRatio: "1 / 1", position: "relative", marginBottom: 14 }}>
              <img
                src={product.images[imgIdx]}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Badge overlay */}
              <div style={{ position: "absolute", top: 14, left: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                {product.badge && <Badge label={product.badge} variant={product.badgeVariant ?? "teal"} />}
                {!product.inStock && <Badge label="OUT OF STOCK" variant="dark" />}
                {disc > 0 && <Badge label={`${disc}% OFF`} variant="red" />}
              </div>
              {/* Wishlist */}
              <button
                onClick={() => { toggle(product.id); addToast(wished ? "Removed from wishlist" : "Saved to wishlist", "info"); }}
                className="wish-btn"
                style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.92)", border: "none", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: wished ? "#F472B6" : T.muted, boxShadow: "0 2px 10px rgba(0,0,0,0.10)" }}
              >
                <Icons.Heart filled={wished} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: 10 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{ width: 76, height: 76, borderRadius: 12, overflow: "hidden", border: `2px solid ${imgIdx === i ? "#1C1C1A" : T.border}`, cursor: "pointer", background: "none", padding: 0, transition: "border-color 0.15s", flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ──────────────────────────────────── */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.teal, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>
              {product.subcategory}
            </p>
            <h1 className="font-display" style={{ fontSize: 34, fontWeight: 400, color: T.txt, lineHeight: 1.18, marginBottom: 14 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Stars n={Math.floor(product.rating)} size={14} />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: T.txt }}>{product.rating.toFixed(1)}</span>
              <span style={{ fontSize: 13, color: T.light }}>({product.reviewCount} reviews)</span>
              <span style={{ color: T.border }}>·</span>
              <span style={{ fontSize: 13, color: product.inStock ? "#1a7a56" : "#e05252", fontWeight: 600 }}>
                {product.inStock ? `In Stock (${product.stockCount} left)` : "Out of Stock"}
              </span>
            </div>

            <Divider margin={20} />

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <Price price={product.price} original={product.originalPrice} size="lg" />
              {disc > 0 && (
                <p style={{ fontSize: 12.5, color: T.muted, marginTop: 4 }}>
                  You save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")} ({disc}% off)
                </p>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.75, marginBottom: 28 }}>{product.description}</p>

            {/* Quantity + CTA */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 10 }}>QUANTITY</p>
              <QtyStepper
                qty={qty}
                onAdd={() => setQty(q => Math.min(q + 1, product.stockCount))}
                onSub={() => setQty(q => Math.max(q - 1, 1))}
                max={product.stockCount}
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <button
                className="btn btn-dark btn-lg"
                disabled={!product.inStock}
                onClick={handleAdd}
                style={{ flex: 1 }}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"} {product.inStock && `— ₹${(product.price * qty).toLocaleString("en-IN")}`}
              </button>
              <button
                onClick={() => { toggle(product.id); addToast(wished ? "Removed from wishlist" : "Saved to wishlist", "info"); }}
                className="btn btn-ghost btn-icon"
                title={wished ? "Remove from wishlist" : "Save to wishlist"}
                style={{ width: 52, color: wished ? "#F472B6" : T.muted, borderColor: wished ? "#F472B6" : T.border }}
              >
                <Icons.Heart filled={wished} />
              </button>
            </div>

            {product.inStock && (
              <button className="btn btn-teal btn-lg btn-full" onClick={() => { handleAdd(); navigate("/checkout"); }}>
                Buy Now — Checkout
              </button>
            )}

            <Divider margin={24} />

            {/* Trust badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: <Icons.Truck />,   text: "Free delivery on orders over ₹999" },
                { icon: <Icons.Shield />,  text: "Secure checkout with 256-bit SSL" },
                { icon: <Icons.Package />, text: "Easy 7-day returns & exchanges" },
                { icon: <Icons.Gift />,    text: "Gift wrapping available at checkout" },
              ].map(item => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: T.teal, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Details, Reviews ───────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: 20, marginTop: 20, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <div style={{ borderBottom: `1px solid ${T.border}`, display: "flex" }}>
            {["Product Details", `Reviews (${reviews.length || product.reviewCount})`].map((t, i) => (
              <button key={t} className={`tab-btn${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>

          <div style={{ padding: "32px" }}>
            {tab === 0 && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.txt, marginBottom: 16 }}>What's Included</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {product.details.map((d, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: T.muted, lineHeight: 1.65 }}>
                      <span style={{ color: T.teal, flexShrink: 0, marginTop: 2 }}><Icons.Check /></span>
                      {d}
                    </li>
                  ))}
                </ul>
                <Divider margin={24} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                  {[
                    { label: "Category",    value: product.subcategory },
                    { label: "SKU",         value: `US-${product.id.toUpperCase()}` },
                    { label: "In Stock",    value: product.inStock ? `${product.stockCount} units` : "Out of stock" },
                    { label: "Rating",      value: `${product.rating} / 5.0` },
                    { label: "Reviews",     value: `${product.reviewCount} verified` },
                    { label: "Ships from",  value: "India (1–4 working days)" },
                  ].map(s => (
                    <div key={s.label} style={{ background: T.sand, borderRadius: 12, padding: "14px 16px" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 5 }}>{s.label.toUpperCase()}</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: T.txt }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 1 && (
              <div>
                {/* Summary */}
                <div style={{ display: "flex", gap: 36, marginBottom: 32, padding: "24px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ textAlign: "center" }}>
                    <p className="font-display" style={{ fontSize: 56, fontWeight: 400, color: T.txt, lineHeight: 1 }}>{product.rating.toFixed(1)}</p>
                    <Stars n={Math.floor(product.rating)} size={16} />
                    <p style={{ fontSize: 12, color: T.light, marginTop: 6 }}>{product.reviewCount} reviews</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[5,4,3,2,1].map(n => {
                      const pct = n === 5 ? 72 : n === 4 ? 18 : n === 3 ? 6 : n === 2 ? 2 : 2;
                      return (
                        <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: T.txt, minWidth: 10 }}>{n}</span>
                          <Icons.Star filled />
                          <div style={{ flex: 1, background: T.border, borderRadius: 999, height: 7, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: "#F59E0B", borderRadius: 999 }} />
                          </div>
                          <span style={{ fontSize: 12, color: T.light, minWidth: 28 }}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review list */}
                {reviews.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: T.txt, marginBottom: 6 }}>No reviews yet for this product</p>
                    <p style={{ fontSize: 13, color: T.light }}>Be the first to share your experience!</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {reviews.map(r => (
                      <div key={r.id} style={{ paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                          <img src={r.avatar} alt={r.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: T.txt }}>{r.name}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                              <Stars n={r.rating} size={11} />
                              <span style={{ fontSize: 11.5, color: T.light }}>{r.date}</span>
                              {r.verified && <span style={{ fontSize: 10.5, fontWeight: 700, color: T.teal, background: "rgba(61,189,181,0.10)", borderRadius: 5, padding: "2px 7px" }}>✓ Verified</span>}
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75 }}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Related products ─────────────────────────────────── */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <SectionHead eyebrow="You May Also Like" title="More from This Category" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
