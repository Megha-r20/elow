import { Link } from "react-router";
import { useToast } from "../../hooks";
import { fullLogoDataUrl, logoDataUrl } from "../../assets/logoBase64";

export function Footer() {
  const { addToast } = useToast();

  return (
    <footer style={{ background: "#1C1C1A", color: "#fff", paddingTop: 48, paddingBottom: 28 }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 36, marginBottom: 40 }} className="footer-grid">
          {/* Brand Section */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ marginBottom: 18, background: "#FFFFFF", display: "inline-block", padding: "10px 18px", borderRadius: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              <img src={fullLogoDataUrl || logoDataUrl} alt="elow" style={{ height: 48, width: "auto", objectFit: "contain", display: "block" }} />
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
  );
}
