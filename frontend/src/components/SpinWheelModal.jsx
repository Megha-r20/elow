import { useState, useRef, useEffect } from "react";
import { useCart, useToast, useDrawer } from "../hooks";

const SECTORS = [
  { label: "₹50 OFF", code: "SPIN50", bg: "#FF69B4", color: "#FFFFFF" },
  { label: "₹100 OFF", code: "SPIN100", bg: "#FFF5BA", color: "#00A896" },
  { label: "NO LUCK", code: "TRY_AGAIN", bg: "#FF3385", color: "#FFFFFF" },
  { label: "₹150 OFF", code: "SPIN150", bg: "#FFF5BA", color: "#00A896" },
  { label: "₹50 OFF", code: "SPIN50", bg: "#FF6B8B", color: "#FFFFFF" },
  { label: "₹250 OFF", code: "SPIN250", bg: "#FFF5BA", color: "#00A896" },
];

export function SpinWheelModal({ isOpen, onClose }) {
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
    const saved = localStorage.getItem("spinWonPrize");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWonPrize(parsed);
        setHasSpun(true);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSpin = (e) => {
    e.preventDefault();
    if (isSpinning) return;

    if (!name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMsg("Please enter a valid phone number");
      return;
    }

    setErrorMsg("");
    setIsSpinning(true);

    const winningOptions = [0, 1, 3, 4, 5];
    const winningIndex = winningOptions[Math.floor(Math.random() * winningOptions.length)];

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
      const prize = SECTORS[winningIndex];
      setWonPrize(prize);
      setHasSpun(true);
      localStorage.setItem("spinWonPrize", JSON.stringify(prize));
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
          background: "rgba(35, 32, 29, 0.55)",
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
          background: "linear-gradient(135deg, #FF69B4 0%, #FF8DA1 35%, #FFA6C9 70%, #FFC0CB 100%)",
          borderRadius: 28,
          boxShadow: "0 25px 70px rgba(255, 105, 180, 0.35), 0 10px 30px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: "4px solid #FFFFFF",
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
            background: "#FFFFFF",
            border: "none",
            color: "#FF1493",
            fontSize: 20,
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
              boxShadow: "0 12px 36px rgba(0,0,0,0.18), inset 0 0 0 6px #FFFFFF",
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
                      <path d={pathData} fill={sector.bg} stroke="#FFFFFF" strokeWidth="0.8" />
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

                <circle cx="50" cy="50" r="10" fill="#FFFFFF" stroke="#FF69B4" strokeWidth="2" />
                <text x="50" y="51" fontSize="9" textAnchor="middle" dominantBaseline="central">
                  🧸
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
                borderRight: "22px solid #00B4D8",
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
                background: "#FFFFFF",
                border: "2px solid #00B4D8",
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
            color: "#FFFFFF",
          }}
        >
          {wonPrize && hasSpun ? (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: 24,
                padding: "28px 24px",
                color: "#23201D",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 8 }}>🎉 🥳</div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#FF1493",
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
                <div
                  style={{
                    background: "#FFF0F5",
                    border: "2px dashed #FF69B4",
                    borderRadius: 14,
                    padding: "12px",
                    margin: "18px 0",
                    fontSize: 20,
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    color: "#D81B60",
                  }}
                >
                  {wonPrize.code}
                </div>
              )}

              {wonPrize.code !== "TRY_AGAIN" ? (
                <button
                  onClick={handleApply}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#00A896",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 14,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(0, 168, 150, 0.35)",
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
                    color: "#FFFFFF",
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
                    color: "#FFFFFF",
                    fontFamily: "'DM Serif Display', serif",
                    lineHeight: 1.1,
                    letterSpacing: "0.5px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  SPIN & WIN! 🥳
                </h2>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.92)", marginTop: 6, fontWeight: 500 }}>
                  Spin the wheel and unlock exclusive stationery discounts instantly.
                </p>
              </div>

              {errorMsg && (
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
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
                  border: "none",
                  fontSize: 14,
                  color: "#23201D",
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
                  border: "none",
                  fontSize: 14,
                  color: "#23201D",
                  outline: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              />

              {/* Phone Input with Country Code */}
              <div style={{ display: "flex", gap: 8 }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    padding: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    color: "#23201D",
                    fontWeight: 600,
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
                    border: "none",
                    fontSize: 14,
                    color: "#23201D",
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
                  background: isSpinning ? "#70E0D0" : "#00A896",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 16,
                  fontSize: 17,
                  fontWeight: 900,
                  letterSpacing: "1px",
                  cursor: isSpinning ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 24px rgba(0, 168, 150, 0.4)",
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

              <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.8)", textAlign: "center" }}>
                By entering, you agree to receive stationery updates and offers from elow.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
