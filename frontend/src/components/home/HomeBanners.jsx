import { useNavigate } from "react-router";
import { HERO_IMAGES } from "../../data";
import { Icons } from "../ui";

export function QuoteBanner() {
  return (
    <section style={{ position: "relative", overflow: "hidden", minHeight: 240, height: "clamp(240px, 35vw, 300px)" }}>
      <img src="/notebook-pen.jpg" alt="Aesthetic notebook and pen" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(28,28,26,0.88) 0%, rgba(28,28,26,0.72) 45%, transparent 80%)" }} />
      <div className="container" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "3px", marginBottom: 12 }}>FOR THE ONES WHO WRITE</p>
          <h2 className="font-display" style={{ fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 400, color: "#fff", fontStyle: "italic", lineHeight: 1.15, textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}>
            "Write it down.<br />Make it yours."
          </h2>
        </div>
      </div>
    </section>
  );
}

export function StudyEssentialsBanner() {
  const navigate = useNavigate();

  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div className="study-essentials-grid">
        {[HERO_IMAGES.writing1, HERO_IMAGES.journalCollage, HERO_IMAGES.washiRolls, HERO_IMAGES.deskPinks].map((img, i) => (
          <div key={i} style={{ overflow: "hidden", height: "100%" }}>
            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(171, 136, 205,0.88) 0%, rgba(171, 136, 205,0.60) 40%, rgba(35,32,29,0.70) 100%)" }} />
      <div className="container" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ padding: "0 12px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "3px", marginBottom: 12 }}>YOUR CREATIVE COMPANION</p>
          <h2 className="font-display" style={{ fontSize: "clamp(26px, 5.5vw, 46px)", color: "#fff", lineHeight: 1.15, marginBottom: 18 }}>
            Start Your Journaling<br />Journey Today
          </h2>
          <button className="btn btn-white btn-lg mobile-full" onClick={() => navigate("/shop?cat=journals")}>
            Shop Journals <Icons.ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export function MarqueeTicker() {
  const items = [
    "A5 Dotted Journals",
    "Pastel Gel Pens",
    "Washi Tape Sets",
    "Kawaii Sticker Books",
    "Weekly Planners",
    "Desk Organizers",
    "Highlighter Sets",
    "Wax Seal Stamps",
  ];

  return (
    <section style={{ background: "#23201D", overflow: "hidden", padding: "18px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <span key={k} style={{ display: "flex", alignItems: "center" }}>
            {items.map((item) => (
              <span key={item} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap", letterSpacing: "0.3px" }}>{item}</span>
                <span style={{ color: "#AB88CD", margin: "0 28px" }}>✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}
