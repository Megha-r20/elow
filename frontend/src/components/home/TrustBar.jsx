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
      <div className="container" style={{ padding: "0" }}>
        <div className="trustbar-grid">
          {features.map((f) => (
            <div key={f.t} className="trustbar-item">
              <span style={{ color: "var(--accent-sage)", flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--txt-espresso)", margin: 0, lineHeight: 1.25 }}>{f.t}</p>
                <p style={{ fontSize: 11.5, color: "var(--txt-light)", marginTop: 2, margin: 0 }}>{f.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
