import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            background: "#FAF7F2",
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 24,
              padding: "48px 36px",
              maxWidth: 520,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(35,32,29,0.08)",
              border: "1px solid #EAE3D9",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#FEE2E2",
                color: "#DC2626",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                marginBottom: 20,
              }}
            >
              ⚠️
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#23201D", margin: "0 0 10px" }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 14, color: "#6E6A63", lineHeight: 1.6, margin: "0 0 28px" }}>
              Don't worry — your shopping cart and account details are completely safe. A temporary issue occurred while rendering this page.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: "#AB88CD",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(171, 136, 205,0.3)",
                }}
              >
                🔄 Try Again
              </button>
              <a
                href="/"
                style={{
                  background: "#FAF7F2",
                  color: "#23201D",
                  border: "1px solid #EAE3D9",
                  padding: "12px 24px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                🏠 Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
