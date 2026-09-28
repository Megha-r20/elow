export function SpinLauncher({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="spin-launcher-btn"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08) translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(171, 136, 205, 0.55), 0 6px 16px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(171, 136, 205, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#FAF7F2",
          color: "#AB88CD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        }}
      >
        🎁
      </span>
      <span>SPIN & WIN!</span>
    </button>
  );
}
