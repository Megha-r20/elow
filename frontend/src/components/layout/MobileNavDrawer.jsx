import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks";
import { Icons } from "../ui";
import { logoDataUrl } from "../../assets/logoBase64";

export function MobileNavDrawer({ isOpen, onClose, onOpenAuth }) {
  const { user, isAdmin, logout } = useAuth();
  const { addToast } = useToast();

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.40)", zIndex: 600, backdropFilter: "blur(3px)" }} />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          background: "#fff",
          zIndex: 700,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          boxShadow: "10px 0 40px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src={logoDataUrl} alt="elow" style={{ height: 40, objectFit: "contain" }} />
          <button onClick={onClose} className="icon-btn">
            <Icons.Close />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
          <Link to="/shop" onClick={onClose} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>
            Shop All
          </Link>
          <Link to="/shop?filter=new" onClick={onClose} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>
            New Arrivals
          </Link>
          <Link to="/shop?cat=gifting" onClick={onClose} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>
            Gifting
          </Link>
          <Link to="/shipping" onClick={onClose} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>
            Shipping Policy
          </Link>
          <Link to="/faq" onClick={onClose} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>
            FAQ
          </Link>
          <Link to="/shop?filter=wishlist" onClick={onClose} style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", textDecoration: "none" }}>
            Wishlist
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={onClose} style={{ fontSize: 16, fontWeight: 700, color: "#AB88CD", textDecoration: "none" }}>
              ⚡ Admin Portal
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                onClose();
                logout();
                addToast("Logged out");
              }}
              style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              style={{ fontSize: 16, fontWeight: 700, color: "#AB88CD", background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </>
  );
}
