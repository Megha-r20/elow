import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router";
import { useCart, useDrawer, useToast } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { CartDrawer } from "./CartDrawer";
import { AccountModal } from "./AccountModal";
import { AuthModal } from "./AuthModal";
import { SpinWheelModal } from "./SpinWheelModal";
import { SpinLauncher } from "./SpinLauncher";
import { ErrorBoundary } from "./ErrorBoundary";
import { Icons } from "./ui";
import { CATEGORIES } from "../data";
import { logoDataUrl, fullLogoDataUrl } from "../assets/logoBase64";
const ANNOUNCE = [
    "Free shipping on orders above ₹999",
    "New drops every Thursday ✦ Use code WRITE50 for ₹50 off",
    "Express delivery across 50+ cities in India",
    "Free gift wrapping on orders above ₹1499",
];
export default function Layout() {
    const { count } = useCart();
    const { openCart } = useDrawer();
    const { addToast } = useToast();
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQ, setSearchQ] = useState("");
    const [mobileNav, setMobileNav] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [spinModalOpen, setSpinModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname, location.search]);

    useEffect(() => {
        if (isAdmin || location.pathname.startsWith("/admin")) return;
        const hasSpun = localStorage.getItem("spinWonPrize");
        if (!hasSpun) {
            const timer = setTimeout(() => {
                setSpinModalOpen(true);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [location.pathname, isAdmin]);
    const isActive = (path) => {
        const [p, q] = path.split("?");
        if (location.pathname !== p && !location.pathname.startsWith(p + "/"))
            return false;
        const currentSearch = new URLSearchParams(location.search);
        if (!q) {
            return !currentSearch.has("cat") && !currentSearch.has("filter");
        }
        const linkSearch = new URLSearchParams(q);
        for (const [k, v] of linkSearch.entries()) {
            if (currentSearch.get(k) !== v)
                return false;
        }
        return true;
    };
    const navLinks = [
        { label: "SHOP", path: "/shop" },
        { label: "NEW IN", path: "/shop?filter=new", dim: true },
        { label: "GIFTING", path: "/shop?cat=gifting" },
        { label: "SHIPPING POLICY", path: "/shipping" },
        { label: "FAQ", path: "/faq" },
    ];
    if (isAdmin) {
        navLinks.push({ label: "⚡ ADMIN PORTAL", path: "/admin" });
    }
    return (<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Announcement bar */}
      <div style={{ background: "#1C1C1A", overflow: "hidden", padding: "8px 0", flexShrink: 0 }}>
        <div className="marquee-track">
          {[0, 1].map(k => (<span key={k} style={{ display: "flex", alignItems: "center" }}>
              {ANNOUNCE.map((m, i) => (<span key={m} style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.82)", whiteSpace: "nowrap" }}>{m}</span>
                  {i < ANNOUNCE.length - 1 && <span style={{ color: "#AB88CD", margin: "0 24px", fontSize: 10 }}>✦</span>}
                </span>))}
              <span style={{ color: "#AB88CD", margin: "0 24px", fontSize: 10 }}>✦</span>
            </span>))}
        </div>
      </div>

      {/* Header Navbar */}
      <header style={{
            position: "sticky", top: 0, zIndex: 350,
            background: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid #EDE8E1",
            boxShadow: "0 4px 20px rgba(35, 32, 29, 0.04)",
            transition: "all 0.2s ease"
        }}>
        <div className="container" style={{ display: "flex", alignItems: "center", height: 70, gap: 28 }}>
          {/* Logo */}
          <button onClick={() => navigate("/")} aria-label="elow home" style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0, transition: "transform 0.15s ease" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
            <img
              src={logoDataUrl}
              alt="elow stationery logo"
              style={{ height: 54, width: "auto", objectFit: "contain" }}
            />
          </button>

          {/* Desktop nav */}
          <nav className="hide-mobile" aria-label="Main Navigation" role="navigation" style={{ display: "flex", gap: 28, alignItems: "center", flex: 1 }}>
            {navLinks.map(link => (link.mega ? (<div key={link.label} className="mega-wrap">
                  <button onClick={() => navigate(link.path)} aria-label={link.label} className={`nav-link${isActive(link.path) ? " active" : ""}`} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
                    {link.label}
                    <span style={{ opacity: 0.5, display: "flex", alignItems: "center" }}><Icons.ChevronDown /></span>
                  </button>
                  <div className="mega-panel">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr) 180px", gap: 28 }}>
                      {[
                { h: "NEW IN", ls: ["New Arrivals", "Just Dropped", "Limited Edition", "Back in Stock"] },
                { h: "CATEGORIES", ls: CATEGORIES.map(c => c.label) },
                { h: "COLLECTIONS", ls: ["The Journaling Edit", "Study Essentials", "Pastel Dreams", "Korean Desk Set"] },
            ].map(col => (<div key={col.h}>
                          <p style={{ fontSize: 9.5, fontWeight: 700, color: "#B8B4AE", letterSpacing: "2px", marginBottom: 14 }}>{col.h}</p>
                          {col.ls.map(l => (<Link key={l} to="/shop" style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "#1C1C1A", textDecoration: "none", padding: "7px 0", borderBottom: "1px solid #F5F0E8", transition: "color 0.13s, padding-left 0.15s" }} onMouseEnter={e => { const el = e.currentTarget; el.style.color = "#AB88CD"; el.style.paddingLeft = "6px"; }} onMouseLeave={e => { const el = e.currentTarget; el.style.color = "#1C1C1A"; el.style.paddingLeft = "0"; }}>{l}</Link>))}
                        </div>))}
                      <div style={{ borderRadius: 14, overflow: "hidden" }}>
                        <div style={{ height: 160, background: "#F5F0E8", borderRadius: 14, overflow: "hidden" }}>
                          <img src={CATEGORIES[0].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#1C1C1A", marginTop: 10 }}>The Journaling Edit</p>
                        <Link to="/shop" style={{ fontSize: 12, color: "#AB88CD", textDecoration: "none", fontWeight: 600 }}>Shop now →</Link>
                      </div>
                    </div>
                  </div>
                </div>) : (<Link key={link.label} to={link.path} className={`nav-link${isActive(link.path) ? " active" : ""}`} style={isActive(link.path)
                ? { color: "#AB88CD", fontWeight: 700 }
                : link.path === "/admin"
                    ? { color: "#AB88CD", fontWeight: 700 }
                    : link.dim
                        ? { color: "#8C8880", fontWeight: 400 }
                        : {}}>
                  {link.label}
                </Link>)))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0, position: "relative" }}>
            <button className="icon-btn" onClick={() => setSearchOpen(o => !o)} title="Search" aria-label="Toggle search bar" aria-expanded={searchOpen}>
              <Icons.Search />
            </button>

            {/* Account / User Menu */}
            {user ? (<div style={{ position: "relative" }}>
                <button className="hide-mobile" onClick={() => setUserDropdownOpen(o => !o)} aria-label="User account menu" aria-expanded={userDropdownOpen} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: isAdmin ? "#1C1C1A" : "#FAF7F2",
                color: isAdmin ? "#FFFFFF" : "#23201D",
                border: isAdmin ? "1px solid #383430" : "1px solid #EAE3D9",
                borderRadius: 999,
                padding: "5px 14px 5px 6px",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.18s ease",
            }}>
                  <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#AB88CD",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isAdmin ? "#FFFFFF" : "#23201D" }}>
                    {user.name.split(" ")[0]}
                  </span>
                  {isAdmin && (<span style={{ fontSize: 9.5, fontWeight: 800, background: "#AB88CD", color: "#FFFFFF", padding: "2px 7px", borderRadius: 999, letterSpacing: "0.5px" }}>
                      ADMIN
                    </span>)}
                  <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>▼</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (<>
                    <div onClick={() => setUserDropdownOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 450 }}/>
                    <div style={{
                    position: "absolute",
                    right: 0,
                    top: "120%",
                    width: 230,
                    background: "#FFFFFF",
                    borderRadius: 16,
                    border: "1px solid #EAE3D9",
                    boxShadow: "0 12px 36px rgba(35,32,29,0.15)",
                    padding: "8px",
                    zIndex: 500,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                }}>
                      <div style={{ padding: "10px 12px", borderBottom: "1px solid #F4EFE6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <p style={{ fontSize: 13.5, fontWeight: 800, color: "#23201D" }}>{user.name}</p>
                          {isAdmin && (<span style={{ fontSize: 9, fontWeight: 800, background: "#1C1C1A", color: "#FFFFFF", padding: "2px 6px", borderRadius: 4 }}>
                              ADMIN
                            </span>)}
                        </div>
                        <p style={{ fontSize: 11, color: "#9C968D", marginTop: 2 }}>{user.email}</p>
                      </div>

                      {isAdmin && (<>
                          <button onClick={() => { setUserDropdownOpen(false); navigate("/admin"); }} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 12px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "#AB88CD",
                        background: "#F2F7F4",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                    }}>
                            ⚡ Admin Control Center
                          </button>
                          <button onClick={() => { setUserDropdownOpen(false); navigate("/shop"); }} style={{
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
                    }}>
                            🛍️ View Store Front
                          </button>
                        </>)}

                      <button onClick={() => { setUserDropdownOpen(false); setAccountOpen(true); }} style={{
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
                }}>
                        📦 My Orders
                      </button>

                      <button onClick={() => { setUserDropdownOpen(false); navigate("/settings"); }} style={{
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
                }}>
                        ⚙️ Profile Settings
                      </button>

                      <button onClick={() => { setUserDropdownOpen(false); logout(); addToast("Logged out successfully"); }} style={{
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
                }}>
                        🚪 Sign Out
                      </button>
                    </div>
                  </>)}
              </div>) : (<button className="icon-btn hide-mobile" title="Sign In / Register" aria-label="Sign in or register" onClick={() => setAuthModalOpen(true)}>
                <Icons.User />
              </button>)}

            <button className="icon-btn hide-mobile" title="Wishlist" aria-label="Wishlist" onClick={() => navigate("/shop?filter=wishlist")}>
              <Icons.Heart />
            </button>
            <button className="icon-btn" onClick={openCart} title="Cart" aria-label={`Shopping cart containing ${count} items`} style={{ padding: "8px 10px" }}>
              <Icons.Bag count={count}/>
            </button>
            {/* Mobile Hamburger toggle */}
            <button className="icon-btn show-mobile-only" onClick={() => setMobileNav(o => !o)} title="Menu" aria-label="Toggle mobile menu" aria-expanded={mobileNav}>
              <svg width="22" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1h20M1 8h20M1 15h20"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileNav && (<>
          <div onClick={() => setMobileNav(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.40)", zIndex: 600, backdropFilter: "blur(3px)" }}/>
          <div style={{
                position: "fixed", top: 0, left: 0, bottom: 0, width: 280, background: "#fff", zIndex: 700,
                padding: "24px", display: "flex", flexDirection: "column", gap: 20, boxShadow: "10px 0 40px rgba(0,0,0,0.15)"
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <img src={logoDataUrl} alt="elow" style={{ height: 40, objectFit: "contain" }}/>
              <button onClick={() => setMobileNav(false)} className="icon-btn"><Icons.Close /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
              <Link to="/shop" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>Shop All</Link>
              <Link to="/shop?filter=new" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>New Arrivals</Link>
              <Link to="/shop?cat=gifting" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>Gifting</Link>
              <Link to="/shipping" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>Shipping Policy</Link>
              <Link to="/faq" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>FAQ</Link>
              <Link to="/shop?filter=wishlist" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>Wishlist</Link>
              {isAdmin && (<Link to="/admin" onClick={() => setMobileNav(false)} style={{ fontSize: 16, fontWeight: 700, color: "#AB88CD", textDecoration: "none" }}>⚡ Admin Portal</Link>)}
              {user ? (<button onClick={() => { setMobileNav(false); logout(); addToast("Logged out"); }} style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}>Sign Out</button>) : (<button onClick={() => { setMobileNav(false); setAuthModalOpen(true); }} style={{ fontSize: 16, fontWeight: 700, color: "#AB88CD", background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}>Sign In / Register</button>)}
            </div>
          </div>
        </>)}

      {/* Account Modal */}
      <AccountModal isOpen={accountOpen} onClose={() => setAccountOpen(false)}/>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)}/>

      {/* Spin & Win Promo Modal (Hidden for Admin users & Admin Portal) */}
      {!isAdmin && !location.pathname.startsWith("/admin") && (
        <>
          <SpinWheelModal isOpen={spinModalOpen} onClose={() => setSpinModalOpen(false)}/>
          <SpinLauncher onClick={() => setSpinModalOpen(true)}/>
        </>
      )}


      {/* Search overlay */}
      {searchOpen && (<>
          <div onClick={() => setSearchOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 400, backdropFilter: "blur(3px)" }}/>
          <div className="search-panel" style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
                background: "#fff", padding: "24px 32px 36px", borderRadius: "0 0 24px 24px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            }}>
            <div className="container" style={{ padding: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 680, margin: "0 auto 28px" }}>
                <span style={{ color: "#B8B4AE", flexShrink: 0 }}><Icons.Search /></span>
                <input autoFocus className="field" value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && searchQ.trim()) {
            setSearchOpen(false);
            navigate(`/shop?q=${encodeURIComponent(searchQ.trim())}`);
        } }} placeholder="Search journals, pens, washi tape, stickers…" style={{ flex: 1, fontSize: 17, border: "none", borderBottom: "2px solid #AB88CD", borderRadius: 0, padding: "8px 0", background: "transparent" }}/>
                <button onClick={() => setSearchOpen(false)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 38, height: 38 }}>
                  <Icons.Close />
                </button>
              </div>
              <div style={{ maxWidth: 680, margin: "0 auto" }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9C968D", letterSpacing: "2px", marginBottom: 14 }}>POPULAR SEARCHES</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["dotted journals", "gel pens", "washi tape", "sticker book", "highlighters", "bullet journal", "weekly planner", "pen case"].map(s => (<button key={s} onClick={() => { setSearchOpen(false); navigate(`/shop?q=${encodeURIComponent(s)}`); }} style={{ background: "#F4EFE6", border: "none", borderRadius: 999, padding: "8px 18px", fontSize: 13, fontWeight: 500, color: "#6E6A63", cursor: "pointer", fontFamily: "inherit", transition: "all 0.14s" }} onMouseEnter={e => { const el = e.currentTarget; el.style.background = "#23201D"; el.style.color = "#FAF7F2"; }} onMouseLeave={e => { const el = e.currentTarget; el.style.background = "#F4EFE6"; el.style.color = "#6E6A63"; }}>{s}</button>))}
                </div>
              </div>
            </div>
          </div>
        </>)}

      {/* Cart drawer */}
      <CartDrawer />

      {/* Main content */}
      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer style={{ background: "#1C1C1A", color: "#fff", paddingTop: 48, paddingBottom: 28 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 36, marginBottom: 40 }} className="footer-grid">
            {/* Brand Section */}
            <div style={{ maxWidth: 320 }}>
              <div style={{ marginBottom: 18, background: "#FFFFFF", display: "inline-block", padding: "10px 18px", borderRadius: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                <img src={fullLogoDataUrl || logoDataUrl} alt="elow" style={{ height: 48, width: "auto", objectFit: "contain", display: "block" }}/>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 18 }}>
                Your home for premium Korean and Japanese-inspired stationery. Beautiful things for beautiful routines.
              </p>
              {/* Social Icon (Instagram) */}
              <div style={{ display: "flex", gap: 10 }}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E1306C";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "#E1306C";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                >
                  IG
                </a>
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "1.8px", marginBottom: 16 }}>SHOP</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "New Arrivals", path: "/shop?filter=new" },
                  { label: "Best Sellers", path: "/shop?filter=best" },
                  { label: "Journals", path: "/shop?cat=journals" },
                  { label: "Pens & Markers", path: "/shop?cat=pens" },
                  { label: "Washi Tape", path: "/shop?cat=washi" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.14s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Column */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "1.8px", marginBottom: 16 }}>HELP</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Contact Us", path: "/contact" },
                  { label: "Shipping Policy", path: "/shipping" },
                  { label: "Returns & Exchanges", path: "/returns" },
                  { label: "Order Tracking", path: "/tracking" },
                  { label: "FAQ", path: "/faq" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.14s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 14,
              padding: "22px 28px",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, color: "#fff", marginBottom: 3 }}>Get stationery inspiration</p>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.48)" }}>Weekly drops, journaling ideas, and exclusive discounts.</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  padding: "9px 16px",
                  color: "#fff",
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                  minWidth: 200,
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#AB88CD")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
              <button
                style={{
                  background: "#AB88CD",
                  color: "#FAF7F2",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onClick={() => addToast("Subscribed to newsletter!", "success")}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#9873BB")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#AB88CD")}
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
                © 2026 ELOW. All rights reserved. Made with care in India.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "About Us", path: "/about" },
                  { label: "Privacy Policy", path: "/privacy" },
                  { label: "Terms & Conditions", path: "/terms" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)", textDecoration: "none", transition: "color 0.14s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {["Visa", "Mastercard", "UPI", "RuPay", "GPay"].map((pm) => (
                <div
                  key={pm}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 5,
                    padding: "3px 8px",
                  }}
                >
                  <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.4px" }}>
                    {pm}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ position: "fixed", bottom: 28, right: 28, zIndex: 400, width: 44, height: 44, background: "#1C1C1A", color: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(0,0,0,0.25)", transition: "transform 0.18s, background 0.18s" }} onMouseEnter={e => { const el = e.currentTarget; el.style.transform = "translateY(-3px)"; el.style.background = "#AB88CD"; }} onMouseLeave={e => { const el = e.currentTarget; el.style.transform = "translateY(0)"; el.style.background = "#1C1C1A"; }}>
        ↑
      </button>
    </div>);
}
