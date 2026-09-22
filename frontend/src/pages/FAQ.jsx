import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, HelpCircle, ArrowLeft, Search } from "lucide-react";

export default function FAQ() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIdx, setOpenIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const T = {
    purple: "#AB88CD",
    purpleDark: "#9873BB",
    cream: "#FAF7F2",
    sand: "#F4EFE6",
    border: "#EAE3D9",
    txt: "#23201D",
    muted: "#6E6A63",
    light: "#9C968D",
  };

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "orders", label: "Orders & Delivery" },
    { id: "products", label: "Products & Quality" },
    { id: "payment", label: "Payment & Coupons" },
    { id: "returns", label: "Returns & Exchanges" },
  ];

  const faqs = [
    {
      cat: "orders",
      q: "How long does shipping take across India?",
      a: "Standard shipping takes 3 to 5 business days for major metro cities (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata). Remote locations may take 5 to 7 business days.",
    },
    {
      cat: "orders",
      q: "Is there free shipping available?",
      a: "Yes! We offer 100% Free Shipping on all orders above ₹999 within India. For orders under ₹999, a flat shipping fee of ₹79 is applied at checkout.",
    },
    {
      cat: "orders",
      q: "How can I track my order status?",
      a: "As soon as your order is dispatched from our warehouse, you will receive an SMS, email, and WhatsApp alert with your direct live tracking link and AWB courier number.",
    },
    {
      cat: "products",
      q: "Are the journals fountain-pen friendly and bleed-proof?",
      a: "Yes! All ELOW journals feature premium 120 GSM to 160 GSM ultra-smooth ivory paper that resists fountain pen bleeding, ghosting, and watercolor feathering.",
    },
    {
      cat: "products",
      q: "Where is ELOW stationery sourced from?",
      a: "Our collections are curated and imported from top Korean and Japanese stationery designers, as well as handcrafted locally in India by skilled artisans.",
    },
    {
      cat: "payment",
      q: "How do I use my 'SPIN & WIN' coupon code?",
      a: "You can apply your promo code directly on the Cart Drawer or Checkout page. Simply enter the code (e.g. SPIN50) into the promo box and click 'Apply'.",
    },
    {
      cat: "payment",
      q: "What payment methods do you accept?",
      a: "We accept UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking across all major Indian banks, and Cash on Delivery (COD).",
    },
    {
      cat: "returns",
      q: "What is your return & exchange policy?",
      a: "We offer a 7-day hassle-free return or replacement policy for items that arrive damaged, defective, or incorrect. Just contact our support team with your order ID.",
    },
    {
      cat: "returns",
      q: "Can I cancel my order after placing it?",
      a: "Yes! Orders can be canceled within 2 hours of placement if they haven't been dispatched yet. Simply email support@elow.in or click 'Cancel Order' in your account dashboard.",
    },
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = activeCategory === "all" || f.cat === activeCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

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
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(171, 136, 205, 0.12)",
              border: "1px solid rgba(171, 136, 205, 0.3)",
              borderRadius: 999,
              padding: "6px 18px",
              marginBottom: 20,
            }}
          >
            <HelpCircle style={{ width: 14, height: 14, color: T.purple }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.purple, letterSpacing: "0.5px" }}>
              FREQUENTLY ASKED QUESTIONS
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
            How Can We Help You?
          </h1>

          <p style={{ fontSize: 16, color: T.muted, maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Find quick answers to common questions about orders, shipping, stationery quality, and coupon codes.
          </p>

          {/* Search box */}
          <div
            style={{
              position: "relative",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            <Search
              style={{
                position: "absolute",
                left: 18,
                top: "50%",
                transform: "translateY(-50%)",
                width: 18,
                height: 18,
                color: T.light,
              }}
            />
            <input
              type="text"
              placeholder="Search for answers (e.g. shipping, GSM, return)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 20px 14px 50px",
                borderRadius: 14,
                border: `1px solid ${T.border}`,
                background: "#FFFFFF",
                fontSize: 14.5,
                color: T.txt,
                outline: "none",
                boxShadow: "0 4px 20px rgba(35, 32, 29, 0.04)",
              }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 36,
          }}
        >
          {categories.map((c) => {
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                style={{
                  background: isActive ? T.purple : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : T.muted,
                  border: isActive ? `1px solid ${T.purple}` : `1px solid ${T.border}`,
                  borderRadius: 999,
                  padding: "8px 20px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isActive ? "0 4px 14px rgba(171, 136, 205, 0.3)" : "none",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 16,
                    border: `1px solid ${T.border}`,
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(35, 32, 29, 0.02)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      background: "none",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "left",
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.txt,
                      cursor: "pointer",
                      gap: 16,
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      style={{
                        width: 18,
                        height: 18,
                        color: T.purple,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: "0 24px 22px 24px",
                        fontSize: 14.5,
                        color: T.muted,
                        lineHeight: 1.75,
                        borderTop: "1px solid #F4EFE6",
                        paddingTop: 16,
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: "#FFFFFF",
                borderRadius: 20,
                border: `1px solid ${T.border}`,
              }}
            >
              <p style={{ fontSize: 16, fontWeight: 700, color: T.txt }}>No matching questions found</p>
              <p style={{ fontSize: 13.5, color: T.muted, marginTop: 6 }}>
                Try searching for another keyword or browse by category.
              </p>
            </div>
          )}
        </div>

        {/* Contact Us Box */}
        <div
          style={{
            marginTop: 48,
            background: "#FFFFFF",
            borderRadius: 20,
            padding: "32px 36px",
            border: `1px solid ${T.border}`,
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 800, color: T.txt, marginBottom: 8 }}>Still have questions?</h3>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 20 }}>
            Can't find the answer you're looking for? Please reach out to our customer care team.
          </p>
          <a
            href="mailto:support@elow.in"
            style={{
              display: "inline-block",
              background: T.purple,
              color: "#FFFFFF",
              borderRadius: 12,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Email Customer Support (support@elow.in)
          </a>
        </div>

      </div>
    </div>
  );
}
