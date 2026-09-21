import { useNavigate } from "react-router";
import { Mail, Phone, ArrowLeft } from "lucide-react";

export default function Contact() {
  const navigate = useNavigate();
  const T = {
    purple: "#8192D4",
    cream: "#FAF7F2",
    sand: "#F4EFE6",
    border: "#EAE3D9",
    txt: "#23201D",
    muted: "#6E6A63",
  };

  return (
    <div style={{ background: T.cream, minHeight: "100vh", padding: "60px 0 100px" }}>
      <div className="container" style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <button onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: T.muted, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 32 }}>
          <ArrowLeft style={{ width: 16, height: 16 }} /> Back
        </button>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 className="font-display" style={{ fontSize: 42, color: T.txt, marginBottom: 12 }}>Contact Us</h1>
          <p style={{ fontSize: 16, color: T.muted }}>We'd love to hear from you! Reach out for order help, collaboration, or feedback.</p>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 24, padding: "40px", border: `1px solid ${T.border}`, boxShadow: "0 8px 30px rgba(35,32,29,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 36 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Mail style={{ color: T.purple, width: 24, height: 24 }} />
              <div>
                <p style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>EMAIL US</p>
                <p style={{ fontSize: 14.5, fontWeight: 700, color: T.txt }}>support@elow.in</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Phone style={{ color: T.purple, width: 24, height: 24 }} />
              <div>
                <p style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>PHONE / WHATSAPP</p>
                <p style={{ fontSize: 14.5, fontWeight: 700, color: T.txt }}>+91 98765 43210</p>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input type="text" placeholder="Your Name" required style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `1px solid ${T.border}`, background: T.cream, fontSize: 14.5 }} />
            <input type="email" placeholder="Your Email" required style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `1px solid ${T.border}`, background: T.cream, fontSize: 14.5 }} />
            <textarea placeholder="How can we help you?" rows="4" required style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `1px solid ${T.border}`, background: T.cream, fontSize: 14.5, fontFamily: "inherit" }}></textarea>
            <button type="submit" style={{ background: T.purple, color: "#FFF", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
