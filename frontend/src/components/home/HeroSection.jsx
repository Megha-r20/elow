import { useNavigate } from "react-router";
import { Icons } from "../ui";

export function HeroSection() {
  const navigate = useNavigate();
  const bgVideoWebm = "/Background_video.webm";

  return (
    <section style={{ position: "relative", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "120px 0 80px" }}>
      {/* Background Video */}
      <video autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
        <source src={bgVideoWebm} type="video/webm" />
        <source src="/Background_video.mp4" type="video/mp4" />
      </video>

      {/* Global subtle light overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(250, 250, 247, 0.35)", zIndex: 1 }} />

      {/* Gradient fade to blend into the next section */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(250, 250, 247, 1) 100%)", zIndex: 1 }} />

      <div className="container" style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(171, 136, 205, 0.12)", border: "1px solid rgba(171, 136, 205, 0.30)", borderRadius: 999, padding: "6px 16px", marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-sage)", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-sage)", letterSpacing: "0.5px" }}>New collection — now live</span>
        </div>

        <h1 className="font-display" style={{ fontSize: 72, fontWeight: 400, color: "var(--txt-espresso)", lineHeight: 1.05, letterSpacing: "-1px", marginBottom: 24, maxWidth: 800 }}>
          Beautiful <span style={{ color: "var(--accent-sage)", fontStyle: "italic" }}>Stationery</span><br />
          for Every Moment.
        </h1>

        <p style={{ fontSize: 18, color: "var(--txt-muted)", lineHeight: 1.75, marginBottom: 40, maxWidth: 540 }}>
          Journals, pens, washi tapes, and more — thoughtfully curated for students, journalers, and everyday creatives across India.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}>
          <button className="btn btn-dark btn-xl" onClick={() => navigate("/shop")}>
            Shop Now <Icons.ArrowRight />
          </button>
          <button className="btn btn-ghost btn-xl" onClick={() => navigate("/shop?cat=journals")} style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(0,0,0,0.05)" }}>
            Explore Journals
          </button>
        </div>

        {/* Social proof */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 48, paddingTop: 36, borderTop: "1px solid rgba(28,28,26,0.1)", flexWrap: "wrap" }}>
          {[
            { n: "10K+", l: "Happy customers" },
            { n: "4.8★", l: "Average rating" },
            { n: "200+", l: "Products available" },
            { n: "Free", l: "Shipping on ₹999+" },
          ].map((s) => (
            <div key={s.n} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--txt-espresso)", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 12.5, color: "var(--txt-light)", marginTop: 8, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
