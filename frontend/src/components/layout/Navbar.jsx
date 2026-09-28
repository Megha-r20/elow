import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useCart, useDrawer, useToast } from "../../hooks";
import { useAuth } from "../../context/AuthContext";
import { Icons } from "../ui";
import { CATEGORIES } from "../../data";
import { logoDataUrl } from "../../assets/logoBase64";

export function Navbar({ onOpenAccount, onOpenAuth, onToggleMobileNav, mobileNavOpen }) {
  const { count } = useCart();
  const { openCart } = useDrawer();
  const { addToast } = useToast();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => {
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

  const handleSearchSubmit = (term) => {
    if (!term || !term.trim()) return;
    setSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 350,
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #EDE8E1",
          boxShadow: "0 4px 20px rgba(35, 32, 29, 0.04)",
          transition: "all 0.2s ease",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", height: 70, gap: 28 }}>
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            aria-label="elow home"
            style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0, transition: "transform 0.15s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img src={logoDataUrl} alt="elow stationery logo" style={{ height: 54, width: "auto", objectFit: "contain" }} />
          </button>

          {/* Desktop nav */}
          <nav className="hide-mobile" aria-label="Main Navigation" role="navigation" style={{ display: "flex", gap: 28, alignItems: "center", flex: 1 }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`nav-link${isActive(link.path) ? " active" : ""}`}
                style={
                  isActive(link.path)
                    ? { color: "#AB88CD", fontWeight: 700 }
                    : link.path === "/admin"
                    ? { color: "#AB88CD", fontWeight: 700 }
                    : link.dim
                    ? { color: "#8C8880", fontWeight: 400 }
                    : {}
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0, position: "relative" }}>
            <button className="icon-btn" onClick={() => setSearchOpen((o) => !o)} title="Search" aria-label="Toggle search bar" aria-expanded={searchOpen}>
              <Icons.Search />
            </button>

            {/* Account / User Menu */}
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  className="hide-mobile"
                  onClick={() => setUserDropdownOpen((o) => !o)}
                  aria-label="User account menu"
                  aria-expanded={userDropdownOpen}
                  style={{
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
                  }}
                >
                  <div
                    style={{
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
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isAdmin ? "#FFFFFF" : "#23201D" }}>
                    {user.name.split(" ")[0]}
                  </span>
                  {isAdmin && (
                    <span style={{ fontSize: 9.5, fontWeight: 800, background: "#AB88CD", color: "#FFFFFF", padding: "2px 7px", borderRadius: 999, letterSpacing: "0.5px" }}>
                      ADMIN
                    </span>
                  )}
                  <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>▼</span>
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
                      }}
                    >
                      <div style={{ padding: "10px 12px", borderBottom: "1px solid #F4EFE6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <p style={{ fontSize: 13.5, fontWeight: 800, color: "#23201D" }}>{user.name}</p>
                          {isAdmin && (
                            <span style={{ fontSize: 9, fontWeight: 800, background: "#1C1C1A", color: "#FFFFFF", padding: "2px 6px", borderRadius: 4 }}>
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 11, color: "#9C968D", marginTop: 2 }}>{user.email}</p>
                      </div>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate("/admin");
                            }}
                            style={{
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
                            }}
                          >
                            ⚡ Admin Control Center
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate("/shop");
                            }}
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
                            🛍️ View Store Front
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAccount();
                        }}
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
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate("/settings");
                        }}
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
                        ⚙️ Profile Settings
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          addToast("Logged out successfully");
                        }}
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
              <button className="icon-btn hide-mobile" title="Sign In / Register" aria-label="Sign in or register" onClick={onOpenAuth}>
                <Icons.User />
              </button>
            )}

            <button className="icon-btn hide-mobile" title="Wishlist" aria-label="Wishlist" onClick={() => navigate("/shop?filter=wishlist")}>
              <Icons.Heart />
            </button>
            <button className="icon-btn" onClick={openCart} title="Cart" aria-label={`Shopping cart containing ${count} items`} style={{ padding: "8px 10px" }}>
              <Icons.Bag count={count} />
            </button>
            {/* Mobile Hamburger toggle */}
            <button className="icon-btn show-mobile-only" onClick={onToggleMobileNav} title="Menu" aria-label="Toggle mobile menu" aria-expanded={mobileNavOpen}>
              <svg width="22" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1h20M1 8h20M1 15h20" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <>
          <div onClick={() => setSearchOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 400, backdropFilter: "blur(3px)" }} />
          <div
            className="search-panel"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 500,
              background: "#fff",
              padding: "24px 32px 36px",
              borderRadius: "0 0 24px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            }}
          >
            <div className="container" style={{ padding: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 680, margin: "0 auto 28px" }}>
                <span style={{ color: "#B8B4AE", flexShrink: 0 }}>
                  <Icons.Search />
                </span>
                <input
                  autoFocus
                  className="field"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit(searchQ);
                  }}
                  placeholder="Search journals, pens, washi tape, stickers..."
                  style={{
                    flex: 1,
                    fontSize: 17,
                    border: "none",
                    borderBottom: "2px solid #AB88CD",
                    borderRadius: 0,
                    padding: "8px 0",
                    background: "transparent",
                  }}
                />
                <button onClick={() => setSearchOpen(false)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 38, height: 38 }}>
                  <Icons.Close />
                </button>
              </div>
              <div style={{ maxWidth: 680, margin: "0 auto" }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9C968D", letterSpacing: "2px", marginBottom: 14 }}>POPULAR SEARCHES</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["dotted journals", "gel pens", "washi tape", "sticker book", "highlighters", "bullet journal", "weekly planner", "pen case"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSearchSubmit(s)}
                      style={{
                        background: "#F4EFE6",
                        border: "none",
                        borderRadius: 999,
                        padding: "8px 18px",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#6E6A63",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.14s",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.background = "#23201D";
                        el.style.color = "#FAF7F2";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.background = "#F4EFE6";
                        el.style.color = "#6E6A63";
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
