import { useNavigate } from "react-router";
import { useCart } from "../hooks";
import { Breadcrumb, QtyStepper, ShippingProgress, Icons, Divider, Price } from "../components/ui";
import { PRODUCTS } from "../data";
import { ProductCard } from "../components/ProductCard";
import { useState } from "react";

const T = { border:"#EDE8E1",txt:"#1C1C1A",muted:"#5C5C58",light:"#8C8880",sand:"#F5F0E8",cream:"#FAFAF7",teal:"#3dbdb5" };

export default function Cart() {
  const navigate = useNavigate();
  const { items, count, subtotal, removeItem, setQty, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError]     = useState("");

  const discount   = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping   = subtotal >= 999 ? 0 : 79;
  const total      = subtotal - discount + shipping;

  const related = PRODUCTS.filter(p => !items.find(i => i.product.id === p.id)).slice(0, 4);

  const applyPromo = () => {
    if (promoCode.toLowerCase() === "write50") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try WRITE50.");
      setPromoApplied(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ background: T.cream, minHeight: "70vh" }}>
        <div className="container" style={{ padding: "64px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.15 }}>
            <Icons.Bag />
          </div>
          <h2 className="font-display" style={{ fontSize: 36, color: T.txt, marginBottom: 12 }}>Your cart is empty</h2>
          <p style={{ fontSize: 15, color: T.muted, marginBottom: 32, lineHeight: 1.75 }}>
            Looks like you haven't added anything yet. Explore our collection to find beautiful stationery for your next creative ritual.
          </p>
          <button className="btn btn-dark btn-xl" onClick={() => navigate("/shop")}>
            Browse Products <Icons.ArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.cream, minHeight: "100vh" }}>
      <div className="container" style={{ padding: "32px 32px 80px" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Cart" }]} />
        <h1 className="font-display" style={{ fontSize: 38, color: T.txt, marginBottom: 8 }}>Your Cart</h1>
        <p style={{ fontSize: 14, color: T.muted, marginBottom: 36 }}>{count} {count === 1 ? "item" : "items"}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
          {/* Items table */}
          <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 16, padding: "16px 24px", borderBottom: `1px solid ${T.border}`, background: T.sand }}>
              {["Product", "Price", "Quantity", "Total", ""].map(h => (
                <p key={h} style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px", textTransform: "uppercase" }}>{h}</p>
              ))}
            </div>

            {/* Items */}
            {items.map(({ product: p, qty }) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 16, padding: "20px 24px", borderBottom: `1px solid ${T.border}`, alignItems: "center" }}>
                {/* Product */}
                <div style={{ display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }} onClick={() => navigate(`/product/${p.id}`)}>
                  <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: `1px solid ${T.border}` }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: T.txt, lineHeight: 1.38, marginBottom: 3 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: T.light }}>{p.subcategory}</p>
                  </div>
                </div>
                {/* Price */}
                <p style={{ fontSize: 14, fontWeight: 600, color: T.txt }}>&#8377;{p.price.toLocaleString("en-IN")}</p>
                {/* Qty */}
                <QtyStepper qty={qty} onAdd={() => setQty(p.id, qty + 1)} onSub={() => setQty(p.id, qty - 1)} max={p.stockCount} />
                {/* Total */}
                <p style={{ fontSize: 14, fontWeight: 700, color: T.txt }}>&#8377;{(p.price * qty).toLocaleString("en-IN")}</p>
                {/* Remove */}
                <button onClick={() => removeItem(p.id)} className="icon-btn" style={{ color: T.light, flexShrink: 0 }} title="Remove">
                  <Icons.Close />
                </button>
              </div>
            ))}

            {/* Cart actions */}
            <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => navigate("/shop")} className="btn btn-ghost btn-sm" style={{ gap: 7 }}>
                <Icons.ChevronLeft /> Continue Shopping
              </button>
              <button onClick={clearCart} style={{ fontSize: 12.5, color: T.light, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, textDecoration: "underline" }}>
                Clear cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 90 }}>
            {/* Shipping progress */}
            <ShippingProgress subtotal={subtotal} />

            {/* Summary card */}
            <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "24px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: T.txt, marginBottom: 20 }}>Order Summary</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {[
                  { l: "Subtotal",  v: `₹${subtotal.toLocaleString("en-IN")}`, strong: false },
                  ...(discount > 0 ? [{ l: "Discount (WRITE50 -10%)", v: `-₹${discount.toLocaleString("en-IN")}`, strong: false, green: true }] : []),
                  { l: shipping === 0 ? "Shipping — FREE" : "Shipping", v: shipping === 0 ? "Free" : `₹${shipping}`, strong: false, green: shipping === 0 },
                ].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: T.muted }}>{r.l}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: (r as any).green ? "#1a7a56" : T.txt }}>{r.v}</span>
                  </div>
                ))}
              </div>

              <Divider margin={0} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "16px 0 20px" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.txt }}>Total</span>
                <span className="font-display" style={{ fontSize: 26, color: T.txt }}>&#8377;{total.toLocaleString("en-IN")}</span>
              </div>

              {/* Promo code */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 10 }}>PROMO CODE</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="field field-sm"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(""); }}
                    placeholder="Enter code (try WRITE50)"
                    disabled={promoApplied}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-dark btn-sm" onClick={applyPromo} disabled={promoApplied || !promoCode}>
                    {promoApplied ? "✓" : "Apply"}
                  </button>
                </div>
                {promoError && <p style={{ fontSize: 12, color: "#e05252", marginTop: 6, fontWeight: 500 }}>{promoError}</p>}
                {promoApplied && <p style={{ fontSize: 12, color: "#1a7a56", marginTop: 6, fontWeight: 600 }}>✓ WRITE50 applied — 10% off!</p>}
              </div>

              <button className="btn btn-dark btn-lg btn-full" style={{ marginBottom: 10 }} onClick={() => navigate("/checkout")}>
                Proceed to Checkout <Icons.ArrowRight />
              </button>
              <p style={{ fontSize: 11.5, color: T.light, textAlign: "center" }}>
                <span style={{ color: T.teal }}>🔒</span> Secure SSL encrypted checkout
              </p>
            </div>

            {/* Trust */}
            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${T.border}`, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <Icons.Shield />,  t: "Secure Payment" },
                { icon: <Icons.Package />, t: "Easy Returns within 7 days" },
                { icon: <Icons.Truck />,   t: "Delivery in 1–4 working days" },
              ].map(f => (
                <div key={f.t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: T.teal }}>{f.icon}</span>
                  <span style={{ fontSize: 12.5, color: T.muted, fontWeight: 500 }}>{f.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* You may also like */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 className="font-display" style={{ fontSize: 28, color: T.txt, marginBottom: 24 }}>You May Also Like</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
