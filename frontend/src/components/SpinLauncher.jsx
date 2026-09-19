export function SpinLauncher({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 28,
        left: 28,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "linear-gradient(135deg, #5E8C77 0%, #4A7261 100%)",
        color: "#FAF7F2",
        border: "3px solid #FAF7F2",
        borderRadius: 999,
        padding: "10px 20px 10px 14px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: "0.4px",
        boxShadow: "0 8px 30px rgba(94, 140, 119, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)",
        transition: "all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08) translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(94, 140, 119, 0.55), 0 6px 16px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(94, 140, 119, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#FAF7F2",
          color: "#5E8C77",
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
