import { useNavigate } from "react-router";
import { HERO_IMAGES } from "../../data";
import { SectionHead } from "../ui";

export function GiftSection() {
  const navigate = useNavigate();

  const giftItems = [
    { label: "Under ₹299", img: HERO_IMAGES.pensPouch, sub: "Small treats & everyday essentials", col: "span 2", row: "span 2", link: "/shop?maxPrice=299" },
    { label: "Under ₹499", img: HERO_IMAGES.washiRolls, sub: "Washi tapes & pen bundles", col: "span 2", row: "span 1", link: "/shop?maxPrice=499" },
    { label: "For Students", img: HERO_IMAGES.bulletJournal, sub: "Planners & study gear", col: "span 1", row: "span 1", link: "/shop?filter=students" },
    { label: "For Journalers", img: HERO_IMAGES.journalCollage, sub: "Complete creative kits", col: "span 1", row: "span 1", link: "/shop?cat=journals" },
  ];

  return (
    <section className="section" style={{ background: "var(--accent-soft-blush)" }}>
      <div className="container">
        <SectionHead eyebrow="Gifting" title="Find the Perfect Gift" center />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridAutoRows: "260px", gap: 16 }}>
          {giftItems.map((g, i) => (
            <button
              key={g.label}
              onClick={() => navigate(g.link)}
              className="hover-card"
              style={{
                gridColumn: g.col,
                gridRow: g.row,
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
                width: "100%",
                height: "100%",
                display: "block",
              }}
            >
              <img src={g.img} alt={g.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,28,26,0.9) 0%, rgba(28,28,26,0.3) 40%, transparent 100%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: i === 0 ? 32 : 24 }}>
                <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", padding: "6px 12px", borderRadius: 999, alignSelf: "flex-start", marginBottom: i === 0 ? 16 : 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>Gift Guide</span>
                </div>
                <h3 className="font-display" style={{ color: "#fff", fontSize: i === 0 ? 42 : 24, lineHeight: 1.1, marginBottom: 8 }}>{g.label}</h3>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: i === 0 ? 16 : 14, fontWeight: 400 }}>{g.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
