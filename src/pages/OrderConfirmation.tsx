import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Icons } from "../components/ui";
import { PRODUCTS } from "../data";
import { ProductCard } from "../components/ProductCard";

const T = { teal:"#3dbdb5",txt:"#1C1C1A",muted:"#5C5C58",light:"#8C8880",border:"#EDE8E1",sand:"#F5F0E8",cream:"#FAFAF7" };

const ORDER_NUM = `US-${new Date().getFullYear()}-${Math.random().toString(36).substring(2,8).toUpperCase()}`;

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const recommended = PRODUCTS.filter(p => p.isBestseller).slice(0, 4);
  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <div style={{ background: T.cream, minHeight: "100vh" }}>
      {/* Success header */}
      <div style={{ background: "linear-gradient(135deg, #edfcfa 0%, #f5f0e8 100%)", padding: "72px 0 60px", textAlign: "center", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: T.teal,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 0 ${show ? "16px" : "0"} rgba(61,189,181,0.14)`,
            transition: "box-shadow 0.6s ease 0.3s",
          }}>
            <span style={{ color: "#fff", fontSize: 36 }}>✓</span>
          </div>
        </div>

        <h1 className="font-display" style={{ fontSize: 48, color: T.txt, marginBottom: 12, lineHeight: 1.1 }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: 16, color: T.muted, marginBottom: 24, lineHeight: 1.75, maxWidth: 480, margin: "0 auto 24px" }}>
          Thank you for your order. We've received it and will start packing it with care. You'll get a shipping confirmation by email soon.
        </p>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "12px 24px" }}>
          <Icons.Package />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px" }}>ORDER NUMBER</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: T.txt, fontFamily: "monospace" }}>{ORDER_NUM}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 32px 80px" }}>
        {/* Status timeline */}
        <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "32px", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.txt, marginBottom: 28 }}>What happens next?</h2>
          <div style={{ display: "flex", gap: 0 }}>
            {[
              { icon: "✓", label: "Order Placed",    sub: "Just now",                  done: true  },
              { icon: "📦", label: "Packing",         sub: "Today – Tomorrow",          done: false },
              { icon: "🚚", label: "Shipped",         sub: "Within 24 hours",           done: false },
              { icon: "🎉", label: "Delivered",       sub: deliveryDate.toLocaleDateString("en-IN", { day: "numeric", month: "long" }), done: false },
            ].map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 96 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: s.done ? T.teal : T.sand, border: `2.5px solid ${s.done ? T.teal : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all 0.3s" }}>
                    {s.done ? <span style={{ color: "#fff", fontSize: 20 }}>✓</span> : <span>{s.icon}</span>}
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: s.done ? T.txt : T.muted, textAlign: "center" }}>{s.label}</p>
                  <p style={{ fontSize: 11.5, color: T.light, textAlign: "center" }}>{s.sub}</p>
                </div>
                {i < 3 && <div style={{ flex: 1, height: 2, background: s.done ? T.teal : T.border, marginBottom: 40, transition: "background 0.3s" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 48 }}>
          {[
            {
              icon: <Icons.Truck />,
              title: "Estimated Delivery",
              text: deliveryDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
              sub: "Standard delivery · 1–4 working days",
            },
            {
              icon: <Icons.Package />,
              title: "Order Updates",
              text: "Check your email",
              sub: "We'll send tracking details once your order ships",
            },
            {
              icon: <Icons.Shield />,
              title: "Need Help?",
              text: "7-day easy returns",
              sub: "Contact us at hello@uniseoul.in",
            },
          ].map(card => (
            <div key={card.title} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${T.border}`, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ color: T.teal }}>{card.icon}</span>
              <div>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 5 }}>{card.title.toUpperCase()}</p>
                <p style={{ fontSize: 14.5, fontWeight: 700, color: T.txt, marginBottom: 4 }}>{card.text}</p>
                <p style={{ fontSize: 12.5, color: T.muted }}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 64, flexWrap: "wrap" }}>
          <button className="btn btn-dark btn-xl" onClick={() => navigate("/shop")}>
            Continue Shopping <Icons.ArrowRight />
          </button>
          <button className="btn btn-ghost btn-xl" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>

        {/* You might like */}
        <div>
          <h2 className="font-display" style={{ fontSize: 30, color: T.txt, marginBottom: 24, textAlign: "center" }}>
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
