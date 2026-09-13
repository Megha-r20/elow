import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Icons, Divider } from "../components/ui";
import { PRODUCTS } from "../data";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../hooks";

const T = { teal:"#5E8C77",txt:"#23201D",muted:"#6E6A63",light:"#9C968D",border:"#EAE3D9",sand:"#F4EFE6",cream:"#FAF7F2" };

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { lastOrder } = useCart();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const recommended = PRODUCTS.filter(p => p.isBestseller).slice(0, 4);
  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const orderId = lastOrder?.id ?? `US-${new Date().getFullYear()}-DEMO88`;
  const items = lastOrder?.items ?? [];
  const address = lastOrder?.deliveryAddress;

  return (
    <div style={{ background: T.cream, minHeight: "100vh" }}>
      {/* Success header */}
      <div style={{ background: "linear-gradient(135deg, #edfcfa 0%, #f5f0e8 100%)", padding: "64px 0 52px", textAlign: "center", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{
            width: 76, height: 76, borderRadius: "50%", background: T.teal,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 0 ${show ? "16px" : "0"} rgba(61,189,181,0.14)`,
            transition: "box-shadow 0.6s ease 0.3s",
          }}>
            <span style={{ color: "#fff", fontSize: 34 }}>✓</span>
          </div>
        </div>

        <h1 className="font-display" style={{ fontSize: 44, color: T.txt, marginBottom: 10, lineHeight: 1.1 }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: 15.5, color: T.muted, marginBottom: 20, lineHeight: 1.75, maxWidth: 480, margin: "0 auto 20px" }}>
          Thank you {address?.firstName ? `${address.firstName} ` : ""}for your order! We've received it and are preparing it with care.
        </p>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "12px 24px" }}>
          <Icons.Package />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px" }}>ORDER NUMBER</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: T.txt, fontFamily: "monospace" }}>{orderId}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 32px 80px" }}>
        {/* Status timeline */}
        <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "28px 32px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.txt, marginBottom: 24 }}>Order Progress</h2>
          <div style={{ display: "flex", gap: 0 }}>
            {[
              { icon: "✓", label: "Order Placed",    sub: "Just now",                  done: true  },
              { icon: "📦", label: "Packing",         sub: "Today – Tomorrow",          done: false },
              { icon: "🚚", label: "Shipped",         sub: "Within 24 hours",           done: false },
              { icon: "🎉", label: "Delivered",       sub: deliveryDate.toLocaleDateString("en-IN", { day: "numeric", month: "long" }), done: false },
            ].map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 96 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: s.done ? T.teal : T.sand, border: `2.5px solid ${s.done ? T.teal : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    {s.done ? <span style={{ color: "#fff", fontSize: 18 }}>✓</span> : <span>{s.icon}</span>}
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: s.done ? T.txt : T.muted, textAlign: "center" }}>{s.label}</p>
                  <p style={{ fontSize: 11.5, color: T.light, textAlign: "center" }}>{s.sub}</p>
                </div>
                {i < 3 && <div style={{ flex: 1, height: 2, background: s.done ? T.teal : T.border, marginBottom: 38 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {lastOrder && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, marginBottom: 32 }}>
            {/* Purchased Items */}
            <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "28px" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: T.txt, marginBottom: 18 }}>Items Ordered ({items.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {items.map(({ product: p, qty }) => (
                  <div key={p.id} style={{ display: "flex", gap: 14, alignItems: "center", paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", border: `1px solid ${T.border}` }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: T.txt }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: T.light }}>{p.subcategory} · Qty: {qty}</p>
                    </div>
                    <p style={{ fontSize: 14.5, fontWeight: 700, color: T.txt }}>&#8377;{(p.price * qty).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "28px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 6 }}>SHIPPING ADDRESS</p>
                <p style={{ fontSize: 13.5, color: T.txt, lineHeight: 1.6, fontWeight: 500 }}>
                  {address?.firstName} {address?.lastName}<br />
                  {address?.address}<br />
                  {address?.city}, {address?.state} — {address?.pincode}<br />
                  {address?.phone}
                </p>
              </div>

              <Divider margin={0} />

              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 6 }}>PAYMENT METHOD</p>
                <p style={{ fontSize: 13.5, color: T.txt, fontWeight: 600 }}>{lastOrder.payMethod.toUpperCase()}</p>
              </div>

              <Divider margin={0} />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.muted }}>
                  <span>Subtotal</span>
                  <span>&#8377;{lastOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {lastOrder.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#1a7a56" }}>
                    <span>Discount</span>
                    <span>-&#8377;{lastOrder.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.muted }}>
                  <span>Shipping</span>
                  <span>{lastOrder.shipping === 0 ? "FREE" : `₹${lastOrder.shipping}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: T.txt, marginTop: 4 }}>
                  <span>Total Paid</span>
                  <span>&#8377;{lastOrder.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 44 }}>
          {[
            {
              icon: <Icons.Truck />,
              title: "Estimated Delivery",
              text: deliveryDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }),
              sub: "Standard delivery · 1–4 working days",
            },
            {
              icon: <Icons.Package />,
              title: "Order Updates",
              text: address?.email ?? "Check your email",
              sub: "We'll send tracking details once your order ships",
            },
            {
              icon: <Icons.Shield />,
              title: "Need Assistance?",
              text: "7-day easy returns",
              sub: "Contact us at support@uniseoul.in",
            },
          ].map(card => (
            <div key={card.title} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${T.border}`, padding: "20px", display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ color: T.teal }}>{card.icon}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 4 }}>{card.title.toUpperCase()}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: T.txt, marginBottom: 4 }}>{card.text}</p>
                <p style={{ fontSize: 12, color: T.muted }}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 56, flexWrap: "wrap" }}>
          <button className="btn btn-dark btn-xl" onClick={() => navigate("/shop")}>
            Continue Shopping <Icons.ArrowRight />
          </button>
          <button className="btn btn-ghost btn-xl" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>

        {/* You might like */}
        <div>
          <h2 className="font-display" style={{ fontSize: 28, color: T.txt, marginBottom: 20, textAlign: "center" }}>
            You Might Also Love
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {recommended.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
