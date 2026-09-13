import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router";
import { useCart, useDrawer, useToast } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { CartDrawer } from "./CartDrawer";
import { AccountModal } from "./AccountModal";
import { AuthModal } from "./AuthModal";
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
  const { user, isAdmin, logout } = useAuth();
  const navigate            = useNavigate();
  const location            = useLocation();
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQ,    setSearchQ]      = useState("");
  const [mobileNav,  setMobileNav]    = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);


  const isActive = (path: string) => {
    const [p, q] = path.split("?");
    if (location.pathname !== p && !location.pathname.startsWith(p + "/")) return false;
    
    const currentSearch = new URLSearchParams(location.search);
    if (!q) {
      return !currentSearch.has("cat") && !currentSearch.has("filter");
    }
    
    const linkSearch = new URLSearchParams(q);
    for (const [k, v] of linkSearch.entries()) {
      if (currentSearch.get(k) !== v) return false;
    }
    return true;
  };

  const navLinks: { label: string; path: string; mega?: boolean; dim?: boolean }[] = [
    { label: "SHOP", path: "/shop" },
    { label: "NEW IN",  path: "/shop?filter=new", dim: true },
    { label: "GIFTING", path: "/shop?cat=gifting" },
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
                  {i < ANNOUNCE.length - 1 && <span style={{ color: "#5E8C77", margin: "0 24px", fontSize: 10 }}>✦</span>}
                </span>
              ))}
              <span style={{ color: "#5E8C77", margin: "0 24px", fontSize: 10 }}>✦</span>
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
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}>
            <img src="/logo.png" alt="elow" style={{ height: 48, objectFit: "contain", borderRadius: 8 }} />
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
                            <Link key={l} to="/shop" style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "#1C1C1A", textDecoration: "none", padding: "7px 0", borderBottom: "1px solid #F5F0E8", transition: "color 0.13s, padding-left 0.15s" }}
                              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#3dbdb5"; el.style.paddingLeft = "6px"; }}
                              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#1C1C1A"; el.style.paddingLeft = "0"; }}
                            >{l}</Link>
                          ))}
                        </div>
                      ))}
                      <div style={{ borderRadius: 14, overflow: "hidden" }}>
                        <div style={{ height: 160, background: "#F5F0E8", borderRadius: 14, overflow: "hidden" }}>
                          <img src={CATEGORIES[0].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#1C1C1A", marginTop: 10 }}>The Journaling Edit</p>
                        <Link to="/shop" style={{ fontSize: 12, color: "#3dbdb5", textDecoration: "none", fontWeight: 600 }}>Shop now →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={link.label} to={link.path}
                  className={`nav-link${isActive(link.path) ? " active" : ""}`}
                  style={link.dim ? { color: "#8C8880", fontWeight: 400 } : {}}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", flexShrink: 0, position: "relative" }}>
            <button className="icon-btn" onClick={() => setSearchOpen(o => !o)} title="Search">
              <Icons.Search />
            </button>

            {/* Account / User Menu */}
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  className="hide-mobile"
                  onClick={() => setUserDropdownOpen(o => !o)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#FAF7F2",
                    border: "1px solid #EAE3D9",
                    borderRadius: 999,
                    padding: "4px 12px 4px 6px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: isAdmin ? "#23201D" : "#5E8C77",
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#23201D" }}>
                    {user.name.split(" ")[0]}
                  </span>
                  {isAdmin && (
                    <span style={{ fontSize: 9.5, fontWeight: 800, background: "#23201D", color: "#FFFFFF", padding: "2px 6px", borderRadius: 4, letterSpacing: "0.5px" }}>
                      ADMIN
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div onClick={() => setUserDropdownOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 450 }} />
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "120%",
                        width: 220,
                        background: "#FFFFFF",
                        borderRadius: 16,
                        border: "1px solid #EAE3D9",
                        boxShadow: "0 12px 36px rgba(35,32,29,0.15)",
                        padding: "8px",
                        zIndex: 500,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <div style={{ padding: "10px 12px", borderBottom: "1px solid #F4EFE6" }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#23201D" }}>{user.name}</p>
                        <p style={{ fontSize: 11, color: "#9C968D" }}>{user.email}</p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => { setUserDropdownOpen(false); navigate("/admin"); }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 12px",
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: "#5E8C77",
                            background: "#F2F7F4",
                            borderRadius: 10,
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          ⚡ Admin Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => { setUserDropdownOpen(false); setAccountOpen(true); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "9px 12px",
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#23201D",
                          background: "none",
                          borderRadius: 10,
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        📦 My Orders
                      </button>

                      <button
                        onClick={() => { setUserDropdownOpen(false); logout(); addToast("Logged out successfully"); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "9px 12px",
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#DC2626",
                          background: "none",
                          borderRadius: 10,
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                className="icon-btn hide-mobile"
                title="Sign In / Register"
                onClick={() => setAuthModalOpen(true)}
              >
                <Icons.User />
              </button>
            )}

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
            {/* Mobile Hamburger toggle */}
            <button className="icon-btn show-mobile-only" onClick={() => setMobileNav(o => !o)} title="Menu">
              <svg width="22" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1h20M1 8h20M1 15h20"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileNav && (
        <>
          <div onClick={() => setMobileNav(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.40)", zIndex: 600, backdropFilter: "blur(3px)" }} />
          <div style={{
            position: "fixed", top: 0, left: 0, bottom: 0, width: 280, background: "#fff", zIndex: 700,
            padding: "24px", display: "flex", flexDirection: "column", gap: 20, boxShadow: "10px 0 40px rgba(0,0,0,0.15)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <img src="/logo.png" alt="elow" style={{ height: 40 }} />
              <button onClick={() => setMobileNav(false)} className="icon-btn"><Icons.Close /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
              <Link to="/shop" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>Shop All</Link>
              <Link to="/shop?filter=new" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>New Arrivals</Link>
              <Link to="/shop?cat=gifting" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>Gifting</Link>
              <Link to="/shop?filter=wishlist" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>Wishlist</Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#5E8C77", textDecoration: "none" }}>⚡ Admin Portal</Link>
              )}
              {user ? (
                <button onClick={() => { setMobileNav(false); logout(); addToast("Logged out"); }} style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}>Sign Out</button>
              ) : (
                <button onClick={() => { setMobileNav(false); setAuthModalOpen(true); }} style={{ fontSize: 16, fontWeight: 700, color: "#5E8C77", background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}>Sign In / Register</button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Account Modal */}
      <AccountModal isOpen={accountOpen} onClose={() => setAccountOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />


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
                  style={{ flex: 1, fontSize: 17, border: "none", borderBottom: "2px solid #5E8C77", borderRadius: 0, padding: "8px 0", background: "transparent" }}
                />
                <button onClick={() => setSearchOpen(false)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 38, height: 38 }}>
                  <Icons.Close />
                </button>
              </div>
              <div style={{ maxWidth: 680, margin: "0 auto" }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9C968D", letterSpacing: "2px", marginBottom: 14 }}>POPULAR SEARCHES</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["dotted journals","gel pens","washi tape","sticker book","highlighters","bullet journal","weekly planner","pen case"].map(s => (
                    <button key={s} onClick={() => { setSearchOpen(false); navigate(`/shop?q=${encodeURIComponent(s)}`); }}
                      style={{ background: "#F4EFE6", border: "none", borderRadius: 999, padding: "8px 18px", fontSize: 13, fontWeight: 500, color: "#6E6A63", cursor: "pointer", fontFamily: "inherit", transition: "all 0.14s" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "#23201D"; el.style.color = "#FAF7F2"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "#F4EFE6"; el.style.color = "#6E6A63"; }}
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
              <div style={{ marginBottom: 20, background: "#fff", display: "inline-block", padding: "8px 12px", borderRadius: 12 }}>
                <img src="/logo.png" alt="elow" style={{ height: 38, objectFit: "contain", display: "block", borderRadius: 6 }} />
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
                    <Link key={l} to="/shop" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", textDecoration: "none", fontWeight: 400, transition: "color 0.14s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
                    >{l}</Link>
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
              <button className="btn btn-teal btn-md" onClick={() => addToast("Subscribed to newsletter!")}>Subscribe</button>
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
