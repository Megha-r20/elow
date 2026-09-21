import { useState, useRef, useEffect } from "react";
import { useCart, useToast, useDrawer } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../api/config";

const SECTORS = [
  { label: "₹50 OFF", bg: "#8192D4", color: "#FAF7F2" },
  { label: "₹100 OFF", bg: "#F4EFE6", color: "#23201D" },
  { label: "NO LUCK", bg: "#5666AA", color: "#FAF7F2" },
  { label: "₹150 OFF", bg: "#D4A359", color: "#23201D" },
  { label: "₹50 OFF", bg: "#6C7CC1", color: "#FAF7F2" },
  { label: "₹250 OFF", bg: "#FAF7F2", color: "#8192D4" },
];

export function SpinWheelModal({ isOpen, onClose }) {
  const { user, token, authFetch } = useAuth();
  const { applyPromo } = useCart();
  const { addToast } = useToast();
  const { openCart } = useDrawer();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSpin = async (e) => {
    e.preventDefault();
    if (isSpinning) return;

    if (!user || !token) {
      setErrorMsg("You must be logged in to spin the wheel.");
      return;
    }

    if (!name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setErrorMsg("");
    setIsSpinning(true);

    let prize;
    let winningIndex = 0;

    try {
      const response = await authFetch(getApiUrl("/api/promo/spin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Failed to spin wheel");
        setIsSpinning(false);
        return;
      }

      winningIndex = data.sectorIndex !== undefined ? data.sectorIndex : 0;
      const baseSector = SECTORS[winningIndex] || SECTORS[0];
      prize = {
        label: data.label || baseSector.label,
        code: data.code,
        minOrderAmount: data.minOrderAmount,
        bg: baseSector.bg,
        color: baseSector.color,
      };
    } catch (err) {
      setErrorMsg("Network error connecting to spin wheel server");
      setIsSpinning(false);
      return;
    }

    const numSectors = SECTORS.length;
    const sectorAngle = 360 / numSectors;

    const targetSectorCenter = winningIndex * sectorAngle + sectorAngle / 2;
    const desiredFinalRotationAngle = (360 - targetSectorCenter) % 360;

    const extraRounds = 5 * 360;
    const currentRotationMod = rotation % 360;
    const delta = (desiredFinalRotationAngle - currentRotationMod + 360) % 360;
    const finalRotation = rotation + extraRounds + delta;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(prize);
      setHasSpun(true);
      if (prize.code !== "TRY_AGAIN") {
        addToast(`🎉 Congratulations! You won ${prize.label}!`, "success");
      }
    }, 4600);
  };

  const handleApply = () => {
    if (wonPrize && wonPrize.code !== "TRY_AGAIN") {
      applyPromo(wonPrize.code);
      addToast(`Applied coupon ${wonPrize.code} (${wonPrize.label}) to cart!`, "success");
      onClose();
      openCart();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(35, 32, 29, 0.65)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: "relative",
          zIndex: 910,
          width: "100%",
          maxWidth: 820,
          background: "linear-gradient(135deg, #6C7CC1 0%, #8192D4 50%, #5666AA 100%)",
          borderRadius: 28,
          boxShadow: "0 25px 70px rgba(35, 32, 29, 0.45), 0 10px 30px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: "4px solid #FAF7F2",
        }}
        className="hide-mobile-grid"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 920,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#FAF7F2",
            border: "none",
            color: "#23201D",
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ✕
        </button>

        {/* LEFT COLUMN: SPIN WHEEL */}
        <div
          style={{
            padding: "36px 20px 36px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Wheel Container */}
          <div
            style={{
              position: "relative",
              width: 310,
              height: 310,
              borderRadius: "50%",
              boxShadow: "0 12px 36px rgba(0,0,0,0.22), inset 0 0 0 6px #FAF7F2",
            }}
          >
            {/* SVG Wheel Slices */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? "transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1)"
                  : "none",
                overflow: "hidden",
              }}
            >
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                {SECTORS.map((sector, i) => {
                  const angle = 360 / SECTORS.length;
                  const startAngle = i * angle;
                  const endAngle = (i + 1) * angle;

                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  const midAngle = startAngle + angle / 2;
                  const textR = 34;
                  const textX = 50 + textR * Math.cos((Math.PI * midAngle) / 180);
                  const textY = 50 + textR * Math.sin((Math.PI * midAngle) / 180);

                  return (
                    <g key={i}>
                      <path d={pathData} fill={sector.bg} stroke="#FAF7F2" strokeWidth="0.8" />
                      <text
                        x={textX}
                        y={textY}
                        fill={sector.color}
                        fontSize="6.5"
                        fontWeight="900"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${midAngle + 180}, ${textX}, ${textY})`}
                      >
                        {sector.label}
                      </text>
                    </g>
                  );
                })}

                <circle cx="50" cy="50" r="10" fill="#FAF7F2" stroke="#8192D4" strokeWidth="2" />
                <text x="50" y="51" fontSize="9" textAnchor="middle" dominantBaseline="central">
                  🎁
                </text>
              </svg>
            </div>

            {/* Pointer / Pin Indicator (At 3 o'clock) */}
            <div
              style={{
                position: "absolute",
                right: -14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
                borderRight: "22px solid #D4A359",
                filter: "drop-shadow(-2px 2px 4px rgba(0,0,0,0.25))",
                zIndex: 15,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#FAF7F2",
                border: "2px solid #D4A359",
                zIndex: 16,
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: FORM OR WIN STATE */}
        <div
          style={{
            padding: "40px 36px 40px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "#FAF7F2",
          }}
        >
          {wonPrize && hasSpun ? (
            <div
              style={{
                background: "#FAF7F2",
                borderRadius: 24,
                padding: "28px 24px",
                color: "#23201D",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 8 }}>🎉 🥳</div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#8192D4",
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                {wonPrize.code === "TRY_AGAIN" ? "Better Luck Next Time!" : "YOU WON!"}
              </h3>
              <p style={{ fontSize: 14, color: "#6E6A63", marginTop: 4, fontWeight: 500 }}>
                {wonPrize.code === "TRY_AGAIN"
                  ? "Don't worry, enjoy shopping our new stationery collection!"
                  : `Use code ${wonPrize.code} to get ${wonPrize.label} on your order.`}
              </p>

              {wonPrize.code !== "TRY_AGAIN" && (
                <>
                  <div
                    style={{
                      background: "#F4EFE6",
                      border: "2px dashed #8192D4",
                      borderRadius: 14,
                      padding: "12px",
                      margin: "18px 0 8px",
                      fontSize: 20,
                      fontWeight: 900,
                      letterSpacing: "1.5px",
                      color: "#23201D",
                    }}
                  >
                    {wonPrize.code}
                  </div>
                  {wonPrize.minOrderAmount ? (
                    <p style={{ fontSize: 12.5, color: "#8192D4", fontWeight: 700, marginBottom: 16 }}>
                      Min. order required: &#8377;{wonPrize.minOrderAmount}
                    </p>
                  ) : null}
                </>
              )}

              {wonPrize.code !== "TRY_AGAIN" ? (
                <button
                  onClick={handleApply}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#8192D4",
                    color: "#FAF7F2",
                    border: "none",
                    borderRadius: 14,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(129, 146, 212, 0.35)",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  Apply Coupon & Open Cart 🛍️
                </button>
              ) : (
                <button
                  onClick={onClose}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#23201D",
                    color: "#FAF7F2",
                    border: "none",
                    borderRadius: 14,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Continue Shopping
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSpin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <h2
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: "#FAF7F2",
                    fontFamily: "'DM Serif Display', serif",
                    lineHeight: 1.1,
                    letterSpacing: "0.5px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  SPIN & WIN! 🥳
                </h2>
                <p style={{ fontSize: 13.5, color: "rgba(250,247,242,0.92)", marginTop: 6, fontWeight: 500 }}>
                  Spin the wheel and unlock exclusive stationery discounts instantly.
                </p>
              </div>

              {errorMsg && (
                <div
                  style={{
                    background: "#FAF7F2",
                    color: "#D9381E",
                    padding: "8px 12px",
                    borderRadius: 10,
                    fontSize: 12.5,
                    fontWeight: 700,
                  }}
                >
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Name Input */}
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 18px",
                  borderRadius: 14,
                  border: "1px solid #EAE3D9",
                  fontSize: 14,
                  color: "#23201D",
                  background: "#FAF7F2",
                  outline: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              />

              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 18px",
                  borderRadius: 14,
                  border: "1px solid #EAE3D9",
                  fontSize: 14,
                  color: "#23201D",
                  background: "#FAF7F2",
                  outline: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              />

              {/* Phone Input with Country Code */}
              <div style={{ display: "flex", gap: 8 }}>
                <div
                  style={{
                    background: "#FAF7F2",
                    borderRadius: 14,
                    padding: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    color: "#23201D",
                    fontWeight: 600,
                    border: "1px solid #EAE3D9",
                  }}
                >
                  <span>🇮🇳</span>
                  <span style={{ fontSize: 11, color: "#9C968D" }}>▼</span>
                </div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "12px 18px",
                    borderRadius: 14,
                    border: "1px solid #EAE3D9",
                    fontSize: 14,
                    color: "#23201D",
                    background: "#FAF7F2",
                    outline: "none",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                  }}
                />
              </div>

              {/* Spin Button */}
              <button
                type="submit"
                disabled={isSpinning}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: isSpinning ? "#5666AA" : "#23201D",
                  color: "#FAF7F2",
                  border: "none",
                  borderRadius: 16,
                  fontSize: 17,
                  fontWeight: 900,
                  letterSpacing: "1px",
                  cursor: isSpinning ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 24px rgba(35, 32, 29, 0.4)",
                  marginTop: 6,
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSpinning) e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  if (!isSpinning) e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {isSpinning ? "SPINNING... 🌀" : "SPIN NOW"}
              </button>

              <p style={{ fontSize: 10.5, color: "rgba(250,247,242,0.8)", textAlign: "center" }}>
                By entering, you agree to receive stationery updates and offers from elow.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
