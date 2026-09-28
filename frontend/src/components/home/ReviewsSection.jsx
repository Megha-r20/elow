import { HERO_IMAGES } from "../../data";
import { SectionHead, Stars } from "../ui";

export function ReviewsSection() {
  const reviews = [
    {
      name: "Ritika S.",
      city: "Mumbai",
      stars: 5,
      date: "Aug 2024",
      img: HERO_IMAGES.writing1,
      text: "The journal quality blew me away — thick pages, beautiful cover, and the dot grid is perfectly subtle. I've been journaling every morning since it arrived.",
    },
    {
      name: "Meghna P.",
      city: "Delhi",
      stars: 5,
      date: "Jul 2024",
      img: HERO_IMAGES.cozySetup,
      text: "Finally found my perfect pen set. The gel pens glide so smoothly and the pastel colours are exactly as shown. Already ordered a second set!",
    },
    {
      name: "Aanya K.",
      city: "Bengaluru",
      stars: 4,
      date: "Jul 2024",
      img: HERO_IMAGES.writing2,
      text: "The washi tape collection is stunning. Repositionable without any residue, and the patterns are so beautiful. Completely transformed my planner.",
    },
  ];

  return (
    <section className="section" style={{ background: "var(--accent-soft-lavender)" }}>
      <div className="container">
        <SectionHead eyebrow="Community" title="What Our Customers Say" center />
        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "clamp(20px, 4vw, 28px)",
                border: "1px solid var(--border-warm)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Stars n={r.stars} size={13} />
              <p style={{ fontSize: "clamp(13.5px, 3.5vw, 14px)", color: "var(--txt-muted)", lineHeight: 1.7, fontStyle: "italic", flex: 1, margin: 0 }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 14, borderTop: "1px solid var(--border-warm)" }}>
                <img src={r.img} alt={r.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--txt-espresso)", margin: 0 }}>{r.name}</p>
                  <p style={{ fontSize: 11.5, color: "var(--txt-light)", margin: 0 }}>{r.city} · Verified · {r.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
