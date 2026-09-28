import { useNavigate } from "react-router";
import { Book, PenTool, Paperclip, Star, Calendar, Notebook, PenBox, Gift } from "lucide-react";
import { SectionHead, Icons } from "../ui";

export function CategoryGrid({ categories }) {
  const navigate = useNavigate();

  return (
    <section className="section" style={{ background: "var(--accent-soft-lavender)" }}>
      <div className="container">
        <SectionHead
          eyebrow="Browse"
          title="Shop by Category"
          sub="Find exactly what you need — from journals to desk accessories."
          right={
            <button onClick={() => navigate("/shop")} className="btn btn-ghost btn-md" style={{ border: "1px solid var(--border-warm)" }}>
              View all <Icons.ArrowRight />
            </button>
          }
        />

        <div className="category-responsive-grid">
          {categories.map((cat) => {
            const iconKey = (cat.id || cat.slug || "").toLowerCase();
            const IconComp =
              {
                journals: Book,
                pens: PenTool,
                washi: Paperclip,
                stickers: Star,
                planners: Calendar,
                notebooks: Notebook,
                desk: PenBox,
                gifting: Gift,
              }[iconKey] ||
              {
                "pens-markers": PenTool,
                "washi-tape": Paperclip,
                "desk-accessories": PenBox,
                "gift-combos": Gift,
              }[iconKey] ||
              Book;

            return (
              <button
                key={cat.id}
                className="hover-card category-card"
                onClick={() => navigate(`/shop?cat=${cat.id}`)}
                style={{
                  border: "none",
                  background: "#fff",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  paddingBottom: 16,
                  overflow: "hidden",
                }}
              >
                <div className="category-card-img-wrap">
                  <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "16px 16px 0 0", background: "#f5f2eb" }}>
                    <img
                      src={cat.image}
                      alt={cat.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", transition: "transform 0.35s ease" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        if (cat.fallbackImage) e.currentTarget.src = cat.fallbackImage;
                      }}
                    />
                  </div>
                  <div
                    className="category-icon-badge"
                    style={{
                      background: cat.color,
                    }}
                  >
                    <IconComp size={18} strokeWidth={2} style={{ color: "rgba(0,0,0,0.6)" }} />
                  </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "0 8px" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "var(--txt-espresso)", letterSpacing: "0.2px", lineHeight: 1.25 }}>{cat.label}</p>
                  <p style={{ fontSize: 11, color: "var(--txt-light)", marginTop: 3 }}>{cat.productCount} items</p>
                  <div style={{ width: 20, height: 2, background: cat.color, borderRadius: 2, marginTop: 12 }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
