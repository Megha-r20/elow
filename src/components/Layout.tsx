import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useCart, useDrawer, useToast } from "../hooks";
import { CartDrawer } from "./CartDrawer";
import { Icons } from "./ui";
import { CATEGORIES } from "../data";

const ANNOUNCE = [
  "Free shipping on orders above ₹999",
  "New drops every Thursday ✦ Use code WRITE50 for ₹50 off",
  "Express delivery across 50+ cities in India",
  "Free gift wrapping on orders above ₹1499",
];

export default function Layout() {
  const { count }           = useCart();
  const { openCart }        = useDrawer();
  const { addToast }        = useToast();
  const navigate            = useNavigate();
  const location            = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ,    setSearchQ]    = useState("");
  const [mobileNav,  setMobileNav]  = useState(false);

  const isActive = (path: string) => {
    const [p, q] = path.split("?");
    if (location.pathname !== p && !location.pathname.startsWith(p + "/")) return false;
    
    const currentSearch = new URLSearchParams(location.search);
    if (!q) {
      // For links like /shop, only active if no cat or filter is selected
      return !currentSearch.has("cat") && !currentSearch.has("filter");
    }
    
    // For links with queries, ensure they match exactly
    const linkSearch = new URLSearchParams(q);
    for (const [k, v] of linkSearch.entries()) {
      if (currentSearch.get(k) !== v) return false;
    }
    return true;
  };

  const navLinks = [
    { label: "SHOP+",   path: "/shop",  mega: true  },
    { label: "NEW IN",  path: "/shop?filter=new" },
    { label: "GIFTING", path: "/shop" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Announcement bar */}
      <div style={{ background: "#1C1C1A", overflow: "hidden", padding: "8px 0", flexShrink: 0 }}>
        <div className="marquee-track">
          {[0, 1].map(k => (
            <span key={k} style={{ display: "flex", alignItems: "center" }}>
              {ANNOUNCE.map((m, i) => (
                <span key={m} style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.82)", whiteSpace: "nowrap" }}>{m}</span>
                  {i < ANNOUNCE.length - 1 && <span style={{ color: "#3dbdb5", margin: "0 24px", fontSize: 10 }}>✦</span>}
                </span>
              ))}
              <span style={{ color: "#3dbdb5", margin: "0 24px", fontSize: 10 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 300, background: "#fff",
        borderBottom: "1px solid #EDE8E1", boxShadow: "0 1px 20px rgba(0,0,0,0.04)",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", height: 66, gap: 24 }}>
          {/* Logo */}
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}>
            <div style={{ width: 34, height: 34, background: "#1C1C1A", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 15, fontFamily: "'DM Serif Display', serif", fontStyle: "italic" }}>u</span>
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#1C1C1A", letterSpacing: "-0.2px" }}>uni seoul</span>
          </button>

          {/* Desktop nav */}
          <nav className="hide-mobile" style={{ display: "flex", gap: 28, alignItems: "center", flex: 1 }}>
            {navLinks.map(link => (
              link.mega ? (
                <div key={link.label} className="mega-wrap">
                  <button
                    onClick={() => navigate(link.path)}
                    className={`nav-link${isActive(link.path) ? " active" : ""}`}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}
                  >
                    {link.label}
                    <span style={{ opacity: 0.5, display: "flex", alignItems: "center" }}><Icons.ChevronDown /></span>
                  </button>
                  <div className="mega-panel">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr) 180px", gap: 28 }}>
                      {[
                        { h: "NEW IN",      ls: ["New Arrivals","Just Dropped","Limited Edition","Back in Stock"] },
                        { h: "CATEGORIES",  ls: CATEGORIES.map(c => c.label) },
                        { h: "COLLECTIONS", ls: ["The Journaling Edit","Study Essentials","Pastel Dreams","Korean Desk Set"] },
                      ].map(col => (
                        <div key={col.h}>
                          <p style={{ fontSize: 9.5, fontWeight: 700, color: "#B8B4AE", letterSpacing: "2px", marginBottom: 14 }}>{col.h}</p>
                          {col.ls.map(l => (
                            <a key={l} href="/shop" style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "#1C1C1A", textDecoration: "none", padding: "7px 0", borderBottom: "1px solid #F5F0E8", transition: "color 0.13s, padding-left 0.15s" }}
                              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#3dbdb5"; el.style.paddingLeft = "6px"; }}
                              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#1C1C1A"; el.style.paddingLeft = "0"; }}
                            >{l}</a>
                          ))}
                        </div>
                      ))}
                      <div style={{ borderRadius: 14, overflow: "hidden" }}>
                        <div style={{ height: 160, background: "#F5F0E8", borderRadius: 14, overflow: "hidden" }}>
                          <img src={CATEGORIES[0].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#1C1C1A", marginTop: 10 }}>The Journaling Edit</p>
                        <a href="/shop" style={{ fontSize: 12, color: "#3dbdb5", textDecoration: "none", fontWeight: 600 }}>Shop now →</a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a key={link.label} href={link.path}
                  className={`nav-link${isActive(link.path) ? " active" : ""}`}
                  style={link.dim ? { color: "#8C8880", fontWeight: 400 } : {}}
                >
                  {link.label}
                </a>
              )
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", flexShrink: 0 }}>
            <button className="icon-btn" onClick={() => setSearchOpen(o => !o)} title="Search">
              <Icons.Search />
            </button>
            <button className="icon-btn hide-mobile" title="Account" onClick={() => addToast("Account portal coming soon", "info")}>
              <Icons.User />
            </button>
            <button className="icon-btn hide-mobile" title="Wishlist" onClick={() => navigate("/shop?filter=wishlist")}>
              <Icons.Heart />
            </button>
            <button
              className="icon-btn"
              onClick={openCart}
              title="Cart"
              style={{ padding: "8px 10px" }}
            >
              <Icons.Bag count={count} />
            </button>
            {/* Hamburger */}
            <button className="icon-btn" style={{ display: "none" }} onClick={() => setMobileNav(o => !o)}
              // Show on mobile via inline media query workaround (CSS class)
            >
              <svg width="20" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 1h18M1 7h18M1 13h18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <>
          <div onClick={() => setSearchOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 400, backdropFilter: "blur(3px)" }} />
          <div className="search-panel" style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
            background: "#fff", padding: "24px 32px 36px", borderRadius: "0 0 24px 24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          }}>
            <div className="container" style={{ padding: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 680, margin: "0 auto 28px" }}>
                <span style={{ color: "#B8B4AE", flexShrink: 0 }}><Icons.Search /></span>
                <input
                  autoFocus
                  className="field"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && searchQ.trim()) { setSearchOpen(false); navigate(`/shop?q=${encodeURIComponent(searchQ.trim())}`); }}}
                  placeholder="Search journals, pens, washi tape, stickers…"
                  style={{ flex: 1, fontSize: 17, border: "none", borderBottom: "2px solid #3dbdb5", borderRadius: 0, padding: "8px 0", background: "transparent" }}
                />
                <button onClick={() => setSearchOpen(false)} className="icon-btn" style={{ background: "#F5F0E8", borderRadius: "50%", width: 38, height: 38 }}>
                  <Icons.Close />
                </button>
              </div>
              <div style={{ maxWidth: 680, margin: "0 auto" }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "#B8B4AE", letterSpacing: "2px", marginBottom: 14 }}>POPULAR SEARCHES</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["dotted journals","gel pens","washi tape","sticker book","highlighters","bullet journal","weekly planner","pen case"].map(s => (
                    <button key={s} onClick={() => { setSearchOpen(false); navigate(`/shop?q=${encodeURIComponent(s)}`); }}
                      style={{ background: "#F5F0E8", border: "none", borderRadius: 999, padding: "8px 18px", fontSize: 13, fontWeight: 500, color: "#5C5C58", cursor: "pointer", fontFamily: "inherit", transition: "all 0.14s" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "#1C1C1A"; el.style.color = "#fff"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "#F5F0E8"; el.style.color = "#5C5C58"; }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart drawer */}
      <CartDrawer />

      {/* Main content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: "#1C1C1A", color: "#fff", paddingTop: 64, paddingBottom: 32 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
                <div style={{ width: 34, height: 34, background: "#3dbdb5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 15, fontFamily: "'DM Serif Display', serif", fontStyle: "italic" }}>u</span>
                </div>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#fff" }}>uni seoul</span>
              </div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, maxWidth: 230, marginBottom: 24 }}>
                Your home for premium Korean and Japanese-inspired stationery. Beautiful things for beautiful routines.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[["IG","#E1306C"],["TT","#000"],["PI","#BD081C"]].map(([l, c]) => (
                  <div key={l} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", transition: "all 0.15s", background: "transparent" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = c; el.style.color = "#fff"; el.style.borderColor = c; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "rgba(255,255,255,0.5)"; el.style.borderColor = "rgba(255,255,255,0.15)"; }}
                  >{l}</div>
                ))}
              </div>
            </div>

            {[
              { h:"Shop",    ls:["New Arrivals","Best Sellers","Journals","Pens & Markers","Washi Tape","Stickers","Planners"] },
              { h:"Help",    ls:["Contact Us","Shipping Policy","Returns & Exchanges","Order Tracking","FAQ"] },
              { h:"Company", ls:["About Us","Journal Blog","Careers","Press","Affiliate Program"] },
            ].map(col => (
              <div key={col.h}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "2px", marginBottom: 20 }}>{col.h.toUpperCase()}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.ls.map(l => (
                    <a key={l} href="/shop" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", textDecoration: "none", fontWeight: 400, transition: "color 0.14s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
                    >{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "28px 32px", marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#fff", marginBottom: 4 }}>Get stationery inspiration</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Weekly drops, journaling ideas, and exclusive discounts.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <input type="email" placeholder="your@email.com" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "11px 20px", color: "#fff", fontSize: 13.5, fontFamily: "inherit", outline: "none", minWidth: 220, transition: "border-color 0.15s" }}
                onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = "#3dbdb5")}
                onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)")}
              />
              <button className="btn btn-teal btn-md">Subscribe</button>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)" }}>
              © 2025 Uni Seoul. All rights reserved. Made with care in India.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["VISA","Mastercard","UPI","RuPay","PayTM","GPay"].map(pm => (
                <div key={pm} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 7, padding: "4px 12px" }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.40)", letterSpacing: "0.3px" }}>{pm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, width: 44, height: 44, background: "#1C1C1A", color: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.20)", transition: "transform 0.18s, background 0.18s" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.background = "#3dbdb5"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.background = "#1C1C1A"; }}
      >
        ↑
      </button>
    </div>
  );
}
