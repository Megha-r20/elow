import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks";
import { Icons } from "./ui";
import { getApiUrl } from "../api/config";

export function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const [mode, setMode] = useState(initialMode); // "login" | "signup" | "forgot"
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "forgot") {
      try {
        const res = await fetch(getApiUrl("/api/auth/forgot-password"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok && data.success) {
          setResetSent(true);
          addToast("Password reset link generated! Check your email inbox.", "success");
        } else {
          setError(data.error || "Failed to request password reset");
        }
      } catch (_err) {
        setLoading(false);
        setError("Network error sending reset instructions");
      }
      return;
    }

    if (mode === "login") {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        addToast(`Welcome back! Logged in as ${role === "admin" ? "Admin" : "Customer"}.`);
        onClose();
      } else {
        setError(res.error || "Failed to log in");
      }
    } else {
      if (!name.trim()) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      const res = await register(name, email, password);
      setLoading(false);
      if (res.success) {
        addToast("Account created successfully!");
        onClose();
      } else {
        setError(res.error || "Failed to create account");
      }
    }
  };

  const fillDemoCustomer = () => {
    setRole("user");
    setMode("login");
    setEmail("ritika@example.com");
    setPassword("password123");
    setError(null);
  };

  const fillDemoAdmin = () => {
    setRole("admin");
    setMode("login");
    setEmail("admin@elow.com");
    setPassword("AdminSecret123!");
    setError(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 700,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Account Login or Registration"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 460,
          maxWidth: "92vw",
          maxHeight: "90vh",
          background: "#FFFFFF",
          zIndex: 750,
          borderRadius: 24,
          boxShadow: "0 24px 64px rgba(35,32,29,0.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #EAE3D9",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 28px 18px",
            background: "#FAF7F2",
            borderBottom: "1px solid #EAE3D9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: "#8192D4",
                textTransform: "uppercase",
              }}
            >
              Authentication
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#23201D", marginTop: 2 }}>
              {mode === "login"
                ? "Welcome Back to Elow"
                : mode === "signup"
                ? "Join the Elow Club"
                : "Reset Your Password"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication modal"
            className="icon-btn"
            style={{
              background: "#F4EFE6",
              borderRadius: "50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Icons.Close />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #EAE3D9", background: "#FFFFFF" }}>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
              setResetSent(false);
            }}
            style={{
              flex: 1,
              padding: "13px",
              fontSize: 13.5,
              fontWeight: 700,
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              color: mode === "login" ? "#8192D4" : "#9C968D",
              borderBottom: `2.5px solid ${mode === "login" ? "#8192D4" : "transparent"}`,
              transition: "all 0.2s ease",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
              setResetSent(false);
            }}
            style={{
              flex: 1,
              padding: "13px",
              fontSize: 13.5,
              fontWeight: 700,
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              color: mode === "signup" ? "#8192D4" : "#9C968D",
              borderBottom: `2.5px solid ${mode === "signup" ? "#8192D4" : "transparent"}`,
              transition: "all 0.2s ease",
            }}
          >
            Create Account
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
          {mode === "forgot" ? (
            resetSent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📩</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#23201D" }}>Check Your Inbox</h3>
                <p style={{ fontSize: 13, color: "#6E6A63", marginTop: 6, lineHeight: 1.5 }}>
                  If an account with <strong>{email}</strong> exists, we have sent instructions to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setResetSent(false);
                  }}
                  className="btn btn-dark btn-md btn-full"
                  style={{ marginTop: 24, borderRadius: 12, padding: "12px", fontWeight: 700 }}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontSize: 13, color: "#6E6A63", lineHeight: 1.5 }}>
                  Enter your registered email address and we'll send you instructions to reset your password.
                </p>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field field-sm"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                {error && (
                  <div
                    style={{
                      background: "#FDF2F2",
                      border: "1px solid #F8B4B4",
                      color: "#9B1C1C",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-dark btn-md btn-full"
                  style={{
                    marginTop: 8,
                    background: "#8192D4",
                    color: "#FFFFFF",
                    borderRadius: 12,
                    padding: "13px",
                    fontWeight: 700,
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Instructions"}
                </button>

                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                    }}
                    style={{ background: "none", border: "none", color: "#8192D4", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )
          ) : (
            <>
              {/* Quick Demo Fill Pills */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9C968D", letterSpacing: "0.5px", marginBottom: 8 }}>
                  DEMO ONE-CLICK FILL:
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    onClick={fillDemoCustomer}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontSize: 11.5,
                      fontWeight: 600,
                      borderRadius: 10,
                      border: "1px solid #EAE3D9",
                      background: role === "user" && email === "ritika@example.com" ? "#F2F7F4" : "#FAF7F2",
                      color: "#23201D",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    👤 Customer Demo
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontSize: 11.5,
                      fontWeight: 600,
                      borderRadius: 10,
                      border: "1px solid #EAE3D9",
                      background: role === "admin" && email === "admin@elow.com" ? "#F5F0F8" : "#FAF7F2",
                      color: "#23201D",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    🔐 Admin Demo
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Account Role Selector */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>
                    ACCOUNT TYPE
                  </label>
                  <div
                    style={{
                      display: "flex",
                      background: "#F4EFE6",
                      padding: 4,
                      borderRadius: 12,
                      gap: 4,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setRole("user")}
                      style={{
                        flex: 1,
                        padding: "7px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 8,
                        border: "none",
                        background: role === "user" ? "#FFFFFF" : "transparent",
                        color: role === "user" ? "#23201D" : "#9C968D",
                        boxShadow: role === "user" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("admin")}
                      style={{
                        flex: 1,
                        padding: "7px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 8,
                        border: "none",
                        background: role === "admin" ? "#23201D" : "transparent",
                        color: role === "admin" ? "#FFFFFF" : "#9C968D",
                        boxShadow: role === "admin" ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      Admin Portal
                    </button>
                  </div>
                </div>

                {/* Name Field (Sign up only) */}
                {mode === "signup" && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ritika Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="field field-sm"
                      style={{ width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={role === "admin" ? "admin@elow.com" : "you@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field field-sm"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D" }}>PASSWORD</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setError(null);
                        }}
                        style={{ background: "none", border: "none", color: "#8192D4", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="field field-sm"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    style={{
                      background: "#FDF2F2",
                      border: "1px solid #F8B4B4",
                      color: "#9B1C1C",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-dark btn-md btn-full"
                  style={{
                    marginTop: 8,
                    background: role === "admin" ? "#23201D" : "#8192D4",
                    color: "#FFFFFF",
                    borderRadius: 12,
                    padding: "13px",
                    fontWeight: 700,
                  }}
                >
                  {loading
                    ? "Processing..."
                    : mode === "login"
                    ? `Sign In as ${role === "admin" ? "Admin" : "Customer"}`
                    : `Register as ${role === "admin" ? "Admin" : "Customer"}`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
