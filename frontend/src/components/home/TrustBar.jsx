import { Icons } from "../ui";

export function TrustBar() {
  const features = [
    { icon: <Icons.Truck />, t: "Free Shipping", s: "On orders over ₹999" },
    { icon: <Icons.Shield />, t: "Secure Checkout", s: "SSL encrypted payment" },
    { icon: <Icons.Package />, t: "Easy Returns", s: "7-day hassle-free returns" },
    { icon: <Icons.Gift />, t: "Gift Wrapping", s: "Free on orders ₹1499+" },
  ];

  return (
    <div style={{ background: "var(--bg-sand)", borderTop: "1px solid var(--border-warm)", borderBottom: "1px solid var(--border-warm)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0 }}>
          {features.map((f, i) => (
            <div
              key={f.t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "20px 36px",
                flex: "1 1 0",
                borderRight: i < 3 ? "1px solid var(--border-warm)" : "none",
                minWidth: 200,
              }}
            >
              <span style={{ color: "var(--accent-sage)" }}>{f.icon}</span>
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--txt-espresso)" }}>{f.t}</p>
                <p style={{ fontSize: 12, color: "var(--txt-light)", marginTop: 2 }}>{f.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
