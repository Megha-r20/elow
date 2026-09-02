import type { ReactNode, CSSProperties } from "react";

/* ─── Icons ─────────────────────────────────────────────────────── */
export const Icons = {
  Search: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="8" cy="8" r="5.5"/><path d="M13.5 13.5L17 17"/>
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="9" cy="6" r="3.5"/><path d="M2 19c0-3.866 3.134-7 7-7s7 3.134 7 7"/>
    </svg>
  ),
  Heart: ({ filled = false }: { filled?: boolean }) => (
    <svg width="18" height="18" fill={filled ? "#F472B6" : "none"} stroke={filled ? "#F472B6" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 16S2 11.5 2 6.25A4.25 4.25 0 0 1 9 3.5a4.25 4.25 0 0 1 7 2.75C16 11.5 9 16 9 16z"/>
    </svg>
  ),
  Bag: ({ count }: { count?: number }) => (
    <div style={{ position: "relative" }}>
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6 8V5.5a4 4 0 0 1 8 0V8"/><rect x="1.5" y="8" width="17" height="11.5" rx="2.5"/>
      </svg>
      {count !== undefined && count > 0 && (
        <span style={{
          position: "absolute", top: -6, right: -8, background: "#3dbdb5", color: "#fff",
          fontSize: 9, fontWeight: 800, borderRadius: "50%", width: 17, height: 17,
          display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FAFAF7",
        }}>{count > 9 ? "9+" : count}</span>
      )}
    </div>
  ),
  Close: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 1l12 12M13 1L1 13"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="10" height="7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 1.5L5 5.5L8.5 1.5"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="8" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1L1 7l6 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="8" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1l6 6-6 6"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 6h14M9 1l6 5-6 5"/>
    </svg>
  ),
  Check: () => (
    <svg width="13" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 5L5 8.5 11.5 1.5"/>
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 1h14M4 7h8M7 13h2"/>
    </svg>
  ),
  Star: ({ filled = true }: { filled?: boolean }) => (
    <svg width="13" height="13" fill={filled ? "#F59E0B" : "#E5E0D8"} viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  Package: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M20 7l-8-4-8 4M20 7v10l-8 4M20 7L12 3 4 7M4 7v10l8 4M12 3v18M4 11l8 4 8-4"/>
    </svg>
  ),
  Truck: () => (
    <svg width="20" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1h11v10H1zM12 4h4l3 3v4h-7V4z"/><circle cx="5" cy="13" r="2"/><circle cx="16" cy="13" r="2"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1L1 4v5c0 4.55 2.97 8.81 7 10 4.03-1.19 7-5.45 7-10V4L8 1z"/>
    </svg>
  ),
  Tag: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1h6l9 9-6 6-9-9V1z"/><circle cx="4" cy="4" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Gift: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="16" height="3" rx="1"/><rect x="2.5" y="9" width="13" height="8" rx="1"/>
      <path d="M9 6V17M6.5 3c0-1.4 1.1-2.5 2.5-2.5S11.5 1.6 11.5 3 9 6 9 6 6.5 4.4 6.5 3z"/>
    </svg>
  ),
};

/* ─── Stars ─────────────────────────────────────────────────────── */
export function Stars({ n, size = 12, showCount, count }: { n: number; size?: number; showCount?: boolean; count?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: showCount ? 6 : 2 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ fontSize: size, display: "inline-block" }}>
            <Icons.Star filled={i <= n} />
          </span>
        ))}
      </div>
      {showCount && count !== undefined && (
        <span style={{ fontSize: size + 1, color: "#8C8880", fontWeight: 500 }}>({count})</span>
      )}
    </div>
  );
}

/* ─── Badge ─────────────────────────────────────────────────────── */
const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  teal:   { bg: "#3dbdb5", color: "#fff" },
  yellow: { bg: "#F59E0B", color: "#1C1C1A" },
  red:    { bg: "#ef4444", color: "#fff" },
  pink:   { bg: "#F472B6", color: "#fff" },
  dark:   { bg: "#1C1C1A", color: "#fff" },
  sage:   { bg: "#86C99E", color: "#1C1C1A" },
};

export function Badge({ label, variant = "teal" }: { label: string; variant?: keyof typeof BADGE_STYLES }) {
  const { bg, color } = BADGE_STYLES[variant] ?? BADGE_STYLES.teal;
  return (
    <span className="badge" style={{ background: bg, color, boxShadow: `0 2px 6px ${bg}55` }}>
      {label}
    </span>
  );
}

/* ─── Section header ─────────────────────────────────────────────── */
export function SectionHead({
  eyebrow, title, sub, right, center,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  right?: ReactNode;
  center?: boolean;
}) {
  return (
    <div style={{
      display: "flex", justifyContent: center ? "center" : "space-between",
      alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 12,
      textAlign: center ? "center" : "left",
    }}>
      <div style={{ flex: 1 }}>
        {eyebrow && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, justifyContent: center ? "center" : "flex-start" }}>
            <span style={{ display: "inline-block", width: 18, height: 1.5, background: "#3dbdb5" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#3dbdb5", letterSpacing: "2px", textTransform: "uppercase" }}>{eyebrow}</span>
          </div>
        )}
        <h2 className="font-display" style={{ fontSize: 30, fontWeight: 400, color: "#1C1C1A", lineHeight: 1.12, letterSpacing: "-0.3px" }}>
          {title}
        </h2>
        {sub && (
          <p style={{ fontSize: 14, color: "#8C8880", marginTop: 8, fontWeight: 400, lineHeight: 1.65, maxWidth: center ? 480 : "none" }}>
            {sub}
          </p>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );
}

/* ─── Price display ─────────────────────────────────────────────── */
export function Price({ price, original, size = "md" }: { price: number; original?: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: { price: 15, og: 12 }, md: { price: 18, og: 13 }, lg: { price: 24, og: 16 } };
  const s = sizes[size];
  const disc = original ? Math.round((1 - price / original) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: s.price, fontWeight: 700, color: "#1C1C1A" }}>&#8377;{price.toLocaleString("en-IN")}</span>
      {original && original > price && (
        <>
          <span style={{ fontSize: s.og, color: "#B8B4AE", textDecoration: "line-through" }}>&#8377;{original.toLocaleString("en-IN")}</span>
          <span style={{ fontSize: s.og, fontWeight: 700, color: "#3dbdb5" }}>{disc}% off</span>
        </>
      )}
    </div>
  );
}

/* ─── Divider ───────────────────────────────────────────────────── */
export function Divider({ margin = 24 }: { margin?: number }) {
  return <div style={{ width: "100%", height: 1, background: "#EDE8E1", margin: `${margin}px 0` }} />;
}

/* ─── Quantity stepper ───────────────────────────────────────────── */
export function QtyStepper({ qty, onAdd, onSub, onChange, min = 1, max = 99 }: {
  qty: number; onAdd: () => void; onSub: () => void; onChange?: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button className="qty-btn" onClick={onSub} disabled={qty <= min}>&#8722;</button>
      <input
        type="number" min={min} max={max} value={qty}
        onChange={e => onChange?.(parseInt(e.target.value) || min)}
        style={{ width: 48, textAlign: "center", border: "1.5px solid #EDE8E1", borderRadius: 8, padding: "7px 0", fontSize: 14, fontWeight: 600, fontFamily: "inherit", outline: "none", background: "#fff", color: "#1C1C1A" }}
      />
      <button className="qty-btn" onClick={onAdd} disabled={qty >= max}>+</button>
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────────────────── */
export function Empty({ icon, title, sub, action }: { icon?: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {icon && <div style={{ fontSize: 48, opacity: 0.3 }}>{icon}</div>}
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1A" }}>{title}</h3>
      {sub && <p style={{ fontSize: 14, color: "#8C8880", maxWidth: 340, lineHeight: 1.65 }}>{sub}</p>}
      {action}
    </div>
  );
}

/* ─── Link button ───────────────────────────────────────────────── */
export function LinkBtn({ to, children, style: sx }: { to: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <a href={to} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#3dbdb5", textDecoration: "none", transition: "gap 0.15s", ...sx }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.gap = "10px")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.gap = "6px")}
    >
      {children} <Icons.ArrowRight />
    </a>
  );
}

/* ─── Breadcrumb ─────────────────────────────────────────────────── */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#8C8880", marginBottom: 24, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
          {item.href ? (
            <a href={item.href} style={{ color: "#8C8880", textDecoration: "none", fontWeight: 500, transition: "color 0.14s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#1C1C1A")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#8C8880")}
            >{item.label}</a>
          ) : (
            <span style={{ color: "#1C1C1A", fontWeight: 600 }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ─── Step indicator ─────────────────────────────────────────────── */
export function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 80 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? "#3dbdb5" : active ? "#1C1C1A" : "#F0ECE4",
                color: done || active ? "#fff" : "#A8A49E",
                fontWeight: 700, fontSize: 13, border: `2px solid ${active ? "#1C1C1A" : done ? "#3dbdb5" : "#EDE8E1"}`,
                transition: "all 0.2s",
              }}>
                {done ? <Icons.Check /> : <span>{i + 1}</span>}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "#1C1C1A" : done ? "#3dbdb5" : "#A8A49E", whiteSpace: "nowrap" }}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1.5, background: done ? "#3dbdb5" : "#EDE8E1", marginBottom: 22, transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Skeleton card ──────────────────────────────────────────────── */
export function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: "#fff", border: "1px solid #EDE8E1" }}>
      <div className="skeleton" style={{ height: 240, borderRadius: 0 }} />
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="skeleton" style={{ height: 14, width: "70%" }} />
        <div className="skeleton" style={{ height: 12, width: "50%" }} />
        <div className="skeleton" style={{ height: 16, width: "40%" }} />
      </div>
    </div>
  );
}

/* ─── Free shipping progress ─────────────────────────────────────── */
export function ShippingProgress({ subtotal, threshold = 999 }: { subtotal: number; threshold?: number }) {
  const rem = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div style={{ background: rem === 0 ? "#e8faf4" : "#F5F0E8", borderRadius: 12, padding: "12px 16px" }}>
      <p style={{ fontSize: 12.5, fontWeight: 600, color: rem === 0 ? "#1a7a56" : "#1C1C1A", marginBottom: 8 }}>
        {rem === 0 ? "🎉 You have FREE shipping!" : `Add ₹${rem} more for FREE shipping`}
      </p>
      <div style={{ background: "#EDE8E1", borderRadius: 999, height: 5, overflow: "hidden" }}>
        <div className="prog-bar" style={{ height: "100%", borderRadius: 999, background: rem === 0 ? "#22c55e" : "#3dbdb5", "--pw": `${pct}%`, width: `${pct}%` } as CSSProperties} />
      </div>
    </div>
  );
}
