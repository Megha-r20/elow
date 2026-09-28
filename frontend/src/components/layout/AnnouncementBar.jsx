export function AnnouncementBar() {
  const announcements = [
    "Free shipping on orders above ₹999",
    "New drops every Thursday ✦ Use code WRITE50 for ₹50 off",
    "Express delivery across 50+ cities in India",
    "Free gift wrapping on orders above ₹1499",
  ];

  return (
    <div style={{ background: "#1C1C1A", overflow: "hidden", padding: "8px 0", flexShrink: 0 }}>
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <span key={k} style={{ display: "flex", alignItems: "center" }}>
            {announcements.map((m, i) => (
              <span key={m} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.82)", whiteSpace: "nowrap" }}>
                  {m}
                </span>
                {i < announcements.length - 1 && <span style={{ color: "#AB88CD", margin: "0 24px", fontSize: 10 }}>✦</span>}
              </span>
            ))}
            <span style={{ color: "#AB88CD", margin: "0 24px", fontSize: 10 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
