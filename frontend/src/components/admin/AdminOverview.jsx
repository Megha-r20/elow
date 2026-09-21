import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, PieChart, ArrowUpRight, BarChart2 } from "lucide-react";
import { getApiUrl } from "../../api/config";

const T = {
  border: "#EAE3D9",
  txt: "#23201D",
  muted: "#6E6A63",
  light: "#9C968D",
  sand: "#F4EFE6",
  cream: "#FAF7F2",
  teal: "#8192D4",
};

export function AdminOverview({ orders = [], products = [], setTab, getStatusBadgeStyle, token }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(getApiUrl("/api/admin/analytics"), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setAnalytics(data);
        }
      } catch (_err) {
        // Fall back gracefully
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const salesTrend = analytics?.salesTrend || [];
  const maxRevenue = Math.max(...salesTrend.map((d) => d.revenue), 100);

  const chartHeight = 160;
  const chartWidth = 500;
  const points = salesTrend.map((d, index) => {
    const x = salesTrend.length > 1 ? (index / (salesTrend.length - 1)) * (chartWidth - 40) + 20 : chartWidth / 2;
    const y = chartHeight - 30 - (d.revenue / maxRevenue) * (chartHeight - 60);
    return { x, y, date: d.date, revenue: d.revenue };
  });

  const svgPath =
    points.length > 0
      ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
      : "";

  const areaPath =
    points.length > 0
      ? `${svgPath} L ${points[points.length - 1].x} ${chartHeight - 10} L ${points[0].x} ${chartHeight - 10} Z`
      : "";

  const categorySales = analytics?.categorySales || [];
  const maxCatRevenue = Math.max(...categorySales.map((c) => c.revenue), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Interactive Analytics Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, flexWrap: "wrap" }}>
        {/* Revenue & Order Trend Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "24px 28px",
            border: `1px solid ${T.border}`,
            boxShadow: "0 8px 30px rgba(35, 32, 29, 0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: T.txt, display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp style={{ width: 20, height: 20, color: T.teal }} /> Revenue & Order Trend
              </h3>
              <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Live store revenue trajectory over time</p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 12px",
                background: "rgba(129, 146, 212, 0.15)",
                color: T.teal,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <ArrowUpRight style={{ width: 14, height: 14 }} /> Real-time
            </span>
          </div>

          {loading ? (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: T.muted }}>
              Loading analytics...
            </div>
          ) : points.length === 0 ? (
            <div style={{ height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 13, color: T.muted }}>
              <BarChart2 style={{ width: 36, height: 36, opacity: 0.3, marginBottom: 8, color: T.teal }} />
              <span>No completed checkout trends recorded yet</span>
            </div>
          ) : (
            <div style={{ width: "100%", overflow: "hidden" }}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: "100%", height: 160, overflow: "visible" }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8192D4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8192D4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="20" y1="30" x2={chartWidth - 20} y2="30" stroke="#EAE3D9" strokeDasharray="4 4" />
                <line x1="20" y1={chartHeight / 2} x2={chartWidth - 20} y2={chartHeight / 2} stroke="#EAE3D9" strokeDasharray="4 4" />
                <line x1="20" y1={chartHeight - 30} x2={chartWidth - 20} y2={chartHeight - 30} stroke="#EAE3D9" strokeDasharray="4 4" />

                <path d={areaPath} fill="url(#revenueGradient)" />
                <path d={svgPath} fill="none" stroke="#8192D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {points.map((p, idx) => (
                  <g key={idx} style={{ cursor: "pointer" }}>
                    <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#8192D4" strokeWidth="2.5" />
                    <title>{`${p.date}: ₹${p.revenue.toLocaleString("en-IN")}`}</title>
                  </g>
                ))}
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.light, fontFamily: "monospace", paddingTop: 8 }}>
                <span>{points[0]?.date || ""}</span>
                <span>{points[points.length - 1]?.date || ""}</span>
              </div>
            </div>
          )}
        </div>

        {/* Category Performance Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "24px 28px",
            border: `1px solid ${T.border}`,
            boxShadow: "0 8px 30px rgba(35, 32, 29, 0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 800, color: T.txt, display: "flex", alignItems: "center", gap: 8 }}>
            <PieChart style={{ width: 20, height: 20, color: T.teal }} /> Category Performance
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {categorySales.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center", fontSize: 13, color: T.muted }}>
                No category sales recorded yet
              </div>
            ) : (
              categorySales.slice(0, 5).map((cat) => {
                const pct = Math.round((cat.revenue / maxCatRevenue) * 100);
                return (
                  <div key={cat.category} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700 }}>
                      <span style={{ textTransform: "capitalize", color: T.txt }}>{cat.category}</span>
                      <span style={{ color: T.teal }}>₹{cat.revenue.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ height: 8, width: "100%", background: T.sand, borderRadius: 999, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          background: T.teal,
                          borderRadius: 999,
                          width: `${pct}%`,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders and Inventory Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, flexWrap: "wrap" }}>
        {/* Recent Customer Orders Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "24px 28px",
            border: `1px solid ${T.border}`,
            boxShadow: "0 8px 30px rgba(35, 32, 29, 0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: T.txt, display: "flex", alignItems: "center", gap: 8 }}>
                <ShoppingBag style={{ width: 20, height: 20, color: T.teal }} /> Recent Customer Orders
              </h3>
              <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Live activity across customer checkout sessions</p>
            </div>
            <button
              onClick={() => setTab("orders")}
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: T.teal,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View All Orders →
            </button>
          </div>

          {orders.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: T.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>🛒</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: T.txt }}>No customer orders placed yet</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Place an order via Checkout to test real-time tracking.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {orders.slice(0, 5).map((o) => {
                const bStyle = getStatusBadgeStyle(o.status || "Processing");
                return (
                  <div
                    key={o.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 14,
                      background: T.cream,
                      borderRadius: 16,
                      border: `1px solid ${T.border}`,
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: T.txt,
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 14,
                        }}
                      >
                        {o.deliveryAddress?.firstName ? o.deliveryAddress.firstName.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 800, color: T.txt }}>
                            #{o.id}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 999,
                              color: bStyle.color,
                              backgroundColor: bStyle.bg,
                              border: `1px solid ${bStyle.border}`,
                            }}
                          >
                            ● {o.status || "Processing"}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: T.muted, margin: "3px 0 0" }}>
                          {o.deliveryAddress?.firstName} {o.deliveryAddress?.lastName} ({o.deliveryAddress?.email}) · {o.items?.length || 0} item(s)
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: T.txt, margin: 0 }}>
                        ₹{(o.total || o.totalAmount || 0).toLocaleString("en-IN")}
                      </p>
                      <p style={{ fontSize: 11, color: T.light, margin: "2px 0 0" }}>{o.date || "Today"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Catalog Inventory Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "24px 28px",
            border: `1px solid ${T.border}`,
            boxShadow: "0 8px 30px rgba(35, 32, 29, 0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 800, color: T.txt }}>Catalog Inventory</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["journals", "planners", "pens", "workspace", "accessories"].map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              const pct = Math.round((count / (products.length || 1)) * 100);
              return (
                <div
                  key={cat}
                  style={{
                    background: T.cream,
                    padding: 12,
                    borderRadius: 14,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                    <span style={{ textTransform: "capitalize", color: T.txt }}>{cat}</span>
                    <span style={{ color: T.teal }}>{count} items ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: T.sand, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: T.teal, borderRadius: 999, width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
