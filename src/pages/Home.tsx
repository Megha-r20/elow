import { useNavigate } from "react-router";
import { SectionHead, Icons, Badge, Stars, Divider } from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS, CATEGORIES, HERO_IMAGES, getFeatured, getBestSellers } from "../data";
import { useCart, useToast } from "../hooks";

const T = {
  teal:    "#3dbdb5",
  cream:   "#FAFAF7",
  sand:    "#F5F0E8",
  border:  "#EDE8E1",
  txt:     "#1C1C1A",
  muted:   "#5C5C58",
  light:   "#8C8880",
};

export default function Home() {
  const navigate   = useNavigate();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const featured   = getFeatured();
  const bestSellers = getBestSellers();

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #FAFAF7 0%, #F5F0E8 50%, #EDF9F8 100%)", padding: "80px 0 72px", overflow: "hidden", position: "relative" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 320, height: 320, borderRadius: "50%", background: "rgba(61,189,181,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(61,189,181,0.04)", pointerEvents: "none" }} />

        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            {/* Left: copy */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(61,189,181,0.10)", border: "1px solid rgba(61,189,181,0.25)", borderRadius: 999, padding: "6px 16px", marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.teal, display: "inline-block" }} />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: T.teal, letterSpacing: "0.5px" }}>New collection — now live</span>
              </div>

              <h1 className="font-display" style={{ fontSize: 64, fontWeight: 400, color: T.txt, lineHeight: 1.05, letterSpacing: "-1px", marginBottom: 24 }}>
                Beautiful<br />
                <span style={{ color: T.teal, fontStyle: "italic" }}>Stationery</span><br />
                for Every Moment.
              </h1>

              <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, marginBottom: 36, maxWidth: 400 }}>
                Journals, pens, washi tapes, and more — thoughtfully curated for students, journalers, and everyday creatives across India.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
                <button className="btn btn-dark btn-xl" onClick={() => navigate("/shop")}>
                  Shop Now <Icons.ArrowRight />
                </button>
                <button className="btn btn-ghost btn-xl" onClick={() => navigate("/shop?cat=journals")}>
                  Explore Journals
                </button>
              </div>

              {/* Social proof */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 28, borderTop: `1px solid ${T.border}`, flexWrap: "wrap" }}>
                {[
                  { n: "10K+",  l: "Happy customers" },
                  { n: "4.8★",  l: "Average rating" },
                  { n: "200+",  l: "Products available" },
                  { n: "Free",  l: "Shipping on ₹999+" },
                ].map(s => (
                  <div key={s.n}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: T.txt, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: 11.5, color: T.light, marginTop: 3, fontWeight: 500 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image mosaic */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, height: 500 }}>
              {[
                { img: HERO_IMAGES.journalCollage, h: 300, align: "start" },
                { img: HERO_IMAGES.washiRolls,     h: 220, align: "end"   },
                { img: HERO_IMAGES.pensPouch,       h: 220, align: "start" },
                { img: HERO_IMAGES.deskPinks,       h: 300, align: "end"   },
              ].map((item, i) => (
                <div key={i} style={{ borderRadius: 20, overflow: "hidden", height: item.h, alignSelf: item.align as "start"|"end", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
                  <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ───────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0 }}>
            {[
              { icon: <Icons.Truck />,   t: "Free Shipping",      s: "On orders over ₹999"  },
              { icon: <Icons.Shield />,  t: "Secure Checkout",    s: "SSL encrypted payment"  },
              { icon: <Icons.Package />, t: "Easy Returns",       s: "7-day hassle-free returns" },
              { icon: <Icons.Gift />,    t: "Gift Wrapping",      s: "Free on orders ₹1499+"  },
            ].map((f, i) => (
              <div key={f.t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 36px", flex: "1 1 0", borderRight: i < 3 ? `1px solid ${T.border}` : "none", minWidth: 200 }}>
                <span style={{ color: T.teal }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: T.txt }}>{f.t}</p>
                  <p style={{ fontSize: 12, color: T.light, marginTop: 2 }}>{f.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories ──────────────────────────────────────────── */}
      <section className="section" style={{ background: T.cream }}>
        <div className="container">
          <SectionHead eyebrow="Browse" title="Shop by Category" sub="Find exactly what you need — from journals to desk accessories." right={
            <button onClick={() => navigate("/shop")} className="btn btn-ghost btn-md">View all <Icons.ArrowRight /></button>
          } />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 20 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} className="hover-card" onClick={() => navigate(`/shop?cat=${cat.id}`)} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ borderRadius: "120px 120px 16px 16px", overflow: "hidden", width: "100%", height: 190, background: cat.color, position: "relative", marginBottom: 16 }}>
                  <img src={cat.image} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "120px 120px 16px 16px", border: "1px solid rgba(0,0,0,0.06)", pointerEvents: "none" }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.txt, letterSpacing: "0.2px" }}>{cat.label}</p>
                  <p style={{ fontSize: 11.5, color: T.light, marginTop: 4 }}>{cat.productCount} items</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────────── */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <SectionHead eyebrow="New Arrivals" title="Fresh Drops" sub="The latest additions to our collection — just landed." right={
            <button onClick={() => navigate("/shop")} className="btn btn-ghost btn-md">See all <Icons.ArrowRight /></button>
          } />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {featured.slice(0, 8).map(p => (
              <ProductCard key={p.id} product={p} compact={true} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial split: The Journaling Edit ────────────────── */}
      <section className="section" style={{ background: T.sand }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
            {/* Image */}
            <div style={{ position: "relative", height: 440 }}>
              <img src={HERO_IMAGES.writing1} alt="The Journaling Edit" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 50%, rgba(245,240,232,0.18) 100%)" }} />
            </div>
            {/* Copy */}
            <div style={{ background: "#fff", padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{ display: "inline-block", width: 20, height: 1.5, background: T.teal }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: T.teal, letterSpacing: "2px" }}>FEATURED COLLECTION</span>
              </div>
              <h2 className="font-display" style={{ fontSize: 42, color: T.txt, lineHeight: 1.12, marginBottom: 20 }}>
                The Journaling Edit
              </h2>
              <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.78, marginBottom: 36 }}>
                Everything you need to build a journaling habit that sticks. Dotted journals, smooth gel pens, decorative washi tapes, and more — curated for beginners and seasoned journalers alike.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
                {["Journals", "Pens", "Washi Tape", "Stickers"].map(t => (
                  <span key={t} style={{ background: T.sand, border: `1px solid ${T.border}`, borderRadius: 999, padding: "6px 16px", fontSize: 12.5, fontWeight: 600, color: T.txt }}>{t}</span>
                ))}
              </div>
              <button className="btn btn-dark btn-lg" onClick={() => navigate("/shop?cat=journals")} style={{ alignSelf: "flex-start" }}>
                Shop the Edit <Icons.ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Best Sellers ─────────────────────────────────────────── */}
      <section className="section" style={{ background: T.cream, overflow: "hidden" }}>
        <div className="container">
          <SectionHead eyebrow="Most Popular" title="Best Sellers" sub="The products our community can't stop buying." right={
            <button onClick={() => navigate("/shop?filter=bestseller")} className="btn btn-ghost btn-md">View all <Icons.ArrowRight /></button>
          } />
          <div className="hide-scroll" style={{ display: "flex", gap: 24, overflowX: "auto", paddingBottom: 32, paddingTop: 16, margin: "0 -32px", paddingLeft: 32, paddingRight: 32, scrollSnapType: "x mandatory" }}>
            {bestSellers.map((p, i) => (
              <div key={p.id} style={{ flex: "0 0 240px", display: "flex", flexDirection: "column", position: "relative", scrollSnapAlign: "start" }}>
                <ProductCard product={p} compact={true} />
                <div style={{ position: "absolute", top: -14, left: -14, width: 44, height: 44, borderRadius: "50%", background: "#1C1C1A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, border: "4px solid #FAFAF7", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial quote banner ───────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", height: 260 }}>
        <img src={HERO_IMAGES.writing3} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(28,28,26,0.82) 0%, rgba(28,28,26,0.55) 55%, transparent 80%)" }} />
        <div className="container" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "3px", marginBottom: 16 }}>FOR THE ONES WHO WRITE</p>
            <h2 className="font-display" style={{ fontSize: 52, fontWeight: 400, color: "#fff", fontStyle: "italic", lineHeight: 1.12, textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}>
              "Write it down.<br />Make it yours."
            </h2>
          </div>
        </div>
      </section>

      {/* ── Gift ideas ───────────────────────────────────────────── */}
      <section className="section" style={{ background: "#FAFAF7" }}>
        <div className="container">
          <SectionHead eyebrow="Gifting" title="Find the Perfect Gift" center />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridAutoRows: "260px", gap: 16 }}>
            {[
              { label: "Under ₹299",    img: HERO_IMAGES.pensPouch,      sub: "Small treats & everyday essentials", col: "span 2", row: "span 2" },
              { label: "Under ₹499",    img: HERO_IMAGES.washiRolls,     sub: "Washi tapes & pen bundles", col: "span 2", row: "span 1" },
              { label: "For Students",  img: HERO_IMAGES.bulletJournal,  sub: "Planners & study gear", col: "span 1", row: "span 1" },
              { label: "For Journalers",img: HERO_IMAGES.journalCollage, sub: "Complete creative kits", col: "span 1", row: "span 1" },
            ].map((g, i) => (
              <button key={g.label} onClick={() => navigate("/shop")} className="hover-card" style={{ gridColumn: g.col, gridRow: g.row, border: "none", background: "none", cursor: "pointer", padding: 0, textAlign: "left", borderRadius: 24, overflow: "hidden", position: "relative", width: "100%", height: "100%", display: "block" }}>
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

      {/* ── Reviews ──────────────────────────────────────────────── */}
      <section className="section" style={{ background: T.sand }}>
        <div className="container">
          <SectionHead eyebrow="Community" title="What Our Customers Say" center />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {[
              { name: "Ritika S.", city: "Mumbai", stars: 5, date: "Aug 2024", img: HERO_IMAGES.writing1,
                text: "The journal quality blew me away — thick pages, beautiful cover, and the dot grid is perfectly subtle. I've been journaling every morning since it arrived." },
              { name: "Meghna P.", city: "Delhi", stars: 5, date: "Jul 2024", img: HERO_IMAGES.cozySetup,
                text: "Finally found my perfect pen set. The gel pens glide so smoothly and the pastel colours are exactly as shown. Already ordered a second set!" },
              { name: "Aanya K.", city: "Bengaluru", stars: 4, date: "Jul 2024", img: HERO_IMAGES.writing2,
                text: "The washi tape collection is stunning. Repositionable without any residue, and the patterns are so beautiful. Completely transformed my planner." },
            ].map((r, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "28px 26px", border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
                <Stars n={r.stars} size={13} />
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, fontStyle: "italic", flex: 1 }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                  <img src={r.img} alt={r.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.txt }}>{r.name}</p>
                    <p style={{ fontSize: 11.5, color: T.light }}>{r.city} · Verified · {r.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Study Essentials banner ──────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", height: 320 }}>
          {[HERO_IMAGES.writing1, HERO_IMAGES.journalCollage, HERO_IMAGES.washiRolls, HERO_IMAGES.deskPinks].map((img, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <img src={img} alt="" style={{ width: "100%", height: 320, objectFit: "cover" }} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(61,189,181,0.88) 0%, rgba(61,189,181,0.60) 40%, rgba(28,28,26,0.70) 100%)" }} />
        <div className="container" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "3px", marginBottom: 16 }}>YOUR CREATIVE COMPANION</p>
            <h2 className="font-display" style={{ fontSize: 46, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
              Start Your Journaling<br />Journey Today
            </h2>
            <button className="btn btn-white btn-lg" onClick={() => navigate("/shop?cat=journals")}>
              Shop Journals <Icons.ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── Recent arrivals marquee ──────────────────────────────── */}
      <section style={{ background: "#1C1C1A", overflow: "hidden", padding: "18px 0", borderTop: `1px solid rgba(255,255,255,0.08)` }}>
        <div className="marquee-track">
          {[0, 1].map(k => (
            <span key={k} style={{ display: "flex", alignItems: "center" }}>
              {["A5 Dotted Journals", "Pastel Gel Pens", "Washi Tape Sets", "Kawaii Sticker Books", "Weekly Planners", "Desk Organizers", "Highlighter Sets", "Wax Seal Stamps"].map((item, i) => (
                <span key={item} style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap", letterSpacing: "0.3px" }}>{item}</span>
                  <span style={{ color: "#3dbdb5", margin: "0 28px" }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
