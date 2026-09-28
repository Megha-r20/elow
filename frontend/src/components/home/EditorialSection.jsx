import { useNavigate } from "react-router";
import { HERO_IMAGES } from "../../data";
import { Icons } from "../ui";

export function EditorialSection() {
  const navigate = useNavigate();

  return (
    <section className="section" style={{ background: "var(--accent-muted-lavender)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          {/* Image */}
          <div style={{ position: "relative", height: 440 }}>
            <img src={HERO_IMAGES.writing1} alt="The Journaling Edit" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "32% center", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 50%, rgba(245,240,232,0.18) 100%)" }} />
          </div>
          {/* Copy */}
          <div style={{ background: "#fff", padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ display: "inline-block", width: 20, height: 1.5, background: "var(--accent-sage)" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-sage)", letterSpacing: "2px" }}>FEATURED COLLECTION</span>
            </div>
            <h2 className="font-display" style={{ fontSize: 42, color: "var(--txt-espresso)", lineHeight: 1.12, marginBottom: 20 }}>
              The Journaling Edit
            </h2>
            <p style={{ fontSize: 14.5, color: "var(--txt-muted)", lineHeight: 1.78, marginBottom: 36 }}>
              Everything you need to build a journaling habit that sticks. Dotted journals, smooth gel pens, decorative washi tapes, and more — curated for beginners and seasoned journalers alike.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
              {["Journals", "Pens", "Washi Tape", "Stickers"].map((t) => (
                <span key={t} style={{ background: "var(--bg-sand)", border: "1px solid var(--border-warm)", borderRadius: 999, padding: "6px 16px", fontSize: 12.5, fontWeight: 600, color: "var(--txt-espresso)" }}>
                  {t}
                </span>
              ))}
            </div>
            <button className="btn btn-dark btn-lg" onClick={() => navigate("/shop?cat=journals")} style={{ alignSelf: "flex-start", background: "linear-gradient(135deg, #AB88CD 0%, #9873BB 100%)", color: "#FAF7F2", border: "none" }}>
              Explore Journaling <Icons.ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
