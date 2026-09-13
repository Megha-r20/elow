import { useNavigate } from "react-router";
import { useCart, useDrawer } from "../hooks";
import { Icons, ShippingProgress, QtyStepper } from "./ui";

export function CartDrawer() {
  const { items, count, subtotal, removeItem, setQty } = useCart();
  const { cartOpen, closeCart } = useDrawer();
  const navigate = useNavigate();

  const goCheckout = () => { closeCart(); navigate("/checkout"); };
  const goCart     = () => { closeCart(); navigate("/cart"); };

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          onClick={closeCart}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 600, backdropFilter: "blur(3px)" }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 420, maxWidth: "100vw",
        background: "#fff", zIndex: 700, display: "flex", flexDirection: "column",
        transform: cartOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(.22,.61,.36,1)",
        boxShadow: "-12px 0 60px rgba(0,0,0,0.12)",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 18px", borderBottom: "1px solid #EDE8E1", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1A", fontFamily: "'DM Serif Display', serif" }}>
              Your Cart
            </h2>
            <p style={{ fontSize: 12.5, color: "#8C8880", marginTop: 2, fontWeight: 500 }}>
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <button onClick={closeCart} className="icon-btn" style={{ background: "#F5F0E8", borderRadius: "50%", width: 36, height: 36, color: "#5C5C58" }}>
            <Icons.Close />
          </button>
        </div>

        {/* Shipping progress */}
        {items.length > 0 && (
          <div style={{ padding: "12px 24px", borderBottom: "1px solid #EDE8E1", flexShrink: 0 }}>
            <ShippingProgress subtotal={subtotal} />
          </div>
        )}

        {/* Items */}
        <div className="hide-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.2 }}>
                <Icons.Bag />
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A", marginBottom: 6 }}>Your cart is empty</p>
              <p style={{ fontSize: 13, color: "#8C8880" }}>Add some beautiful stationery to get started!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {items.map(({ product: p, qty }) => (
                <div key={p.id} style={{ display: "flex", gap: 14, paddingBottom: 18, borderBottom: "1px solid #F5F0E8" }}>
                  <div style={{ width: 84, height: 84, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: "1px solid #EDE8E1", cursor: "pointer" }}
                    onClick={() => { closeCart(); navigate(`/product/${p.id}`); }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#1C1C1A", lineHeight: 1.35 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: "#8C8880" }}>{p.subcategory}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                      <QtyStepper
                        qty={qty} min={1} max={p.stockCount}
                        onAdd={() => setQty(p.id, qty + 1)}
                        onSub={() => setQty(p.id, qty - 1)}
                      />
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1A" }}>&#8377;{(p.price * qty).toLocaleString("en-IN")}</span>
                        <button onClick={() => removeItem(p.id)} style={{ fontSize: 11, color: "#B8B4AE", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "color 0.14s" }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#e05252")}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#B8B4AE")}
                        >Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "18px 24px 28px", borderTop: "1px solid #EDE8E1", flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 14, color: "#5C5C58", fontWeight: 500 }}>Subtotal</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#1C1C1A", fontFamily: "'DM Serif Display', serif" }}>
                &#8377;{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p style={{ fontSize: 11.5, color: "#B8B4AE", textAlign: "center" }}>Taxes and shipping calculated at checkout</p>
            <button onClick={goCheckout} className="btn btn-dark btn-lg btn-full">
              Checkout — &#8377;{subtotal.toLocaleString("en-IN")}
            </button>
            <button onClick={goCart} className="btn btn-ghost btn-md btn-full">
              View Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
