import { useNavigate } from "react-router";
import { HERO_IMAGES } from "../../data";
import { Icons } from "../ui";

export function EditorialSection() {
  const navigate = useNavigate();

  return (
    <section className="section" style={{ background: "var(--accent-muted-lavender)" }}>
      <div className="container">
        <div className="editorial-grid">
          {/* Image */}
          <div className="editorial-img-box">
            <img src={HERO_IMAGES.writing1} alt="The Journaling Edit" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "32% center", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 50%, rgba(245,240,232,0.18) 100%)" }} />
          </div>
          {/* Copy */}
          <div className="editorial-copy-box">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ display: "inline-block", width: 20, height: 1.5, background: "var(--accent-sage)" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-sage)", letterSpacing: "2px" }}>FEATURED COLLECTION</span>
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(26px, 5.5vw, 42px)", color: "var(--txt-espresso)", lineHeight: 1.15, marginBottom: 16 }}>
              The Journaling Edit
            </h2>
            <p style={{ fontSize: "clamp(13.5px, 3.5vw, 14.5px)", color: "var(--txt-muted)", lineHeight: 1.7, marginBottom: 24 }}>
              Everything you need to build a journaling habit that sticks. Dotted journals, smooth gel pens, decorative washi tapes, and more — curated for beginners and seasoned journalers alike.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              {["Journals", "Pens", "Washi Tape", "Stickers"].map((t) => (
                <span key={t} style={{ background: "var(--bg-sand)", border: "1px solid var(--border-warm)", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 600, color: "var(--txt-espresso)" }}>
                  {t}
                </span>
              ))}
            </div>
            <button className="btn btn-dark btn-lg mobile-full" onClick={() => navigate("/shop?cat=journals")} style={{ alignSelf: "flex-start", background: "linear-gradient(135deg, #AB88CD 0%, #9873BB 100%)", color: "#FAF7F2", border: "none" }}>
              Explore Journaling <Icons.ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
