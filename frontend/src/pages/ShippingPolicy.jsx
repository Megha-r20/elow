import { useNavigate } from "react-router";
import { Truck, Package, Clock, ShieldCheck, ArrowLeft } from "lucide-react";

export default function ShippingPolicy() {
  const navigate = useNavigate();

  const T = {
    purple: "#8192D4",
    purpleDark: "#6C7CC1",
    cream: "#FAF7F2",
    sand: "#F4EFE6",
    border: "#EAE3D9",
    txt: "#23201D",
    muted: "#6E6A63",
    light: "#9C968D",
  };

  const highlights = [
    {
      icon: <Truck style={{ width: 24, height: 24, color: T.purple }} />,
      title: "Free Shipping on ₹999+",
      desc: "Enjoy free standard shipping on all orders over ₹999 within India.",
    },
    {
      icon: <Clock style={{ width: 24, height: 24, color: T.purple }} />,
      title: "3 – 5 Days Delivery",
      desc: "Standard orders arrive within 3 to 5 business days for major Indian cities.",
    },
    {
      icon: <Package style={{ width: 24, height: 24, color: T.purple }} />,
      title: "Eco & Safe Packaging",
      desc: "Every item is bubble wrapped with love in our signature pastel gift boxes.",
    },
    {
      icon: <ShieldCheck style={{ width: 24, height: 24, color: T.purple }} />,
      title: "Live SMS & WhatsApp Tracking",
      desc: "Receive real-time tracking links as soon as your order leaves our warehouse.",
    },
  ];

  return (
    <div style={{ background: T.cream, minHeight: "100vh", padding: "60px 0 100px" }}>
      <div className="container" style={{ maxWidth: 840, margin: "0 auto", padding: "0 24px" }}>
        
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            color: T.muted,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 32,
            padding: 0,
          }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} /> Back
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(129, 146, 212, 0.12)",
              border: "1px solid rgba(129, 146, 212, 0.3)",
              borderRadius: 999,
              padding: "6px 18px",
              marginBottom: 20,
            }}
          >
            <Truck style={{ width: 14, height: 14, color: T.purple }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.purple, letterSpacing: "0.5px" }}>
              DELIVERY & DISPATCH GUIDELINES
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 44,
              fontWeight: 400,
              color: T.txt,
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Shipping & Delivery Policy
          </h1>

          <p style={{ fontSize: 16, color: T.muted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Everything you need to know about order processing, delivery timelines, packaging, and shipping charges.
          </p>
        </div>

        {/* Highlight Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 20,
            marginBottom: 56,
          }}
        >
          {highlights.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#FFFFFF",
                borderRadius: 18,
                padding: "24px 28px",
                border: `1px solid ${T.border}`,
                boxShadow: "0 4px 20px rgba(35, 32, 29, 0.03)",
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(129, 146, 212, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: T.txt, marginBottom: 6 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Content Sections */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "40px 48px",
            border: `1px solid ${T.border}`,
            boxShadow: "0 8px 30px rgba(35, 32, 29, 0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 36,
          }}
        >
          {/* Section 1 */}
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: T.txt,
                marginBottom: 12,
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              1. Order Processing Time
            </h2>
            <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.8, marginBottom: 12 }}>
              All orders are dispatched from our warehouse in Mumbai within <strong>24 to 48 hours</strong> on business days (Monday through Saturday). Orders placed on Sundays or national holidays will be processed on the next business day.
            </p>
            <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.8 }}>
              During sale events, collection launches, or festive seasons (like Diwali), processing may take up to 72 hours due to high volume.
            </p>
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${T.border}` }} />

          {/* Section 2 */}
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: T.txt,
                marginBottom: 12,
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              2. Shipping Charges
            </h2>
            <div style={{ overflowX: "auto", marginTop: 14, marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: T.sand }}>
                    <th style={{ padding: "12px 16px", borderRadius: "8px 0 0 8px", color: T.txt }}>Order Value</th>
                    <th style={{ padding: "12px 16px", color: T.txt }}>Shipping Fee</th>
                    <th style={{ padding: "12px 16px", borderRadius: "0 8px 8px 0", color: T.txt }}>Estimated Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600 }}>Below ₹999</td>
                    <td style={{ padding: "14px 16px", color: T.purple, fontWeight: 700 }}>₹79 Standard Flat Rate</td>
                    <td style={{ padding: "14px 16px", color: T.muted }}>3 – 5 Business Days</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "14px 16px", fontWeight: 600 }}>₹999 and above</td>
                    <td style={{ padding: "14px 16px", color: "#2E7D32", fontWeight: 700 }}>FREE 🎉</td>
                    <td style={{ padding: "14px 16px", color: T.muted }}>3 – 5 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${T.border}` }} />

          {/* Section 3 */}
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: T.txt,
                marginBottom: 12,
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              3. Courier Partners & Tracking
            </h2>
            <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.8, marginBottom: 14 }}>
              We partner with trusted courier logistics including <strong>BlueDart, Delhivery, Expressbees, and DTDC</strong> to ensure safe and fast delivery of your stationery goods.
            </p>
            <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.8 }}>
              Once dispatched, you will receive an automated email and WhatsApp notification containing your Tracking ID and direct tracking URL.
            </p>
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${T.border}` }} />

          {/* Section 4 */}
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: T.txt,
                marginBottom: 12,
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              4. Damaged or Missing Shipments
            </h2>
            <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.8 }}>
              If your package arrives damaged or missing items, please email us within <strong>48 hours of delivery</strong> at <a href="mailto:support@elow.in" style={{ color: T.purple, fontWeight: 700 }}>support@elow.in</a> with photos/videos of the package. We will issue a free replacement or store credit right away.
            </p>
          </div>
        </div>

        {/* Need Help Footer Banner */}
        <div
          style={{
            marginTop: 48,
            background: "linear-gradient(135deg, #8192D4 0%, #6C7CC1 100%)",
            borderRadius: 20,
            padding: "32px 40px",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Have questions about your order?</h3>
            <p style={{ fontSize: 14, opacity: 0.9 }}>Our stationery support team is happy to assist you anytime.</p>
          </div>
          <button
            onClick={() => navigate("/faq")}
            style={{
              background: "#FFFFFF",
              color: T.purple,
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Visit FAQ Page →
          </button>
        </div>

      </div>
    </div>
  );
}
