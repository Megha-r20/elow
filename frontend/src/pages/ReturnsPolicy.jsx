import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function ReturnsPolicy() {
  const navigate = useNavigate();
  const T = { purple: "#8192D4", cream: "#FAF7F2", border: "#EAE3D9", txt: "#23201D", muted: "#6E6A63" };

  return (
    <div style={{ background: T.cream, minHeight: "100vh", padding: "60px 0 100px" }}>
      <div className="container" style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <button onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: T.muted, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 32 }}>
          <ArrowLeft style={{ width: 16, height: 16 }} /> Back
        </button>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 className="font-display" style={{ fontSize: 42, color: T.txt, marginBottom: 12 }}>Returns & Exchanges</h1>
          <p style={{ fontSize: 16, color: T.muted }}>7-day hassle-free replacements and easy return requests.</p>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 24, padding: "40px", border: `1px solid ${T.border}`, boxShadow: "0 8px 30px rgba(35,32,29,0.04)", display: "flex", flexDirection: "column", gap: 24, fontSize: 15, color: T.muted, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.txt, fontFamily: "'DM Serif Display', serif" }}>7-Day Replacement Guarantee</h2>
          <p>If your items arrive damaged, defective, or incorrect, you can request a 100% free replacement within 7 days of delivery.</p>
          <hr style={{ border: "none", borderTop: `1px solid ${T.border}` }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.txt, fontFamily: "'DM Serif Display', serif" }}>How to Initiate a Return</h2>
          <p>1. Send an email to <strong>support@elow.in</strong> with your Order ID and photo of the issue.<br />2. Our team will verify and dispatch a pickup/replacement within 24 hours.</p>
        </div>
      </div>
    </div>
  );
}
