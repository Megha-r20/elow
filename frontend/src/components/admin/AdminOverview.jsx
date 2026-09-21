import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, PieChart, ArrowUpRight, BarChart2 } from "lucide-react";
import { getApiUrl } from "../../api/config";

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
        // Fall back to client calculation if endpoint fails
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Extract sales trend or fallback
  const salesTrend = analytics?.salesTrend || [];
  const maxRevenue = Math.max(...salesTrend.map((d) => d.revenue), 100);

  // SVG Chart Geometry parameters
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
    <div className="space-y-6">
      {/* Interactive Analytics Charts Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Revenue Trend SVG Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-warm-grey-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-semibold text-charcoal flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-soft-lavender-600" /> Revenue & Order Trend
              </h3>
              <p className="text-xs text-dusty-taupe mt-0.5">Live store revenue trajectory over time</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Real-time
            </span>
          </div>

          {loading ? (
            <div className="h-44 flex items-center justify-center text-xs text-dusty-taupe">Loading analytics...</div>
          ) : points.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-xs text-dusty-taupe">
              <BarChart2 className="w-8 h-8 mb-2 opacity-40 text-soft-lavender-500" />
              <span>No completed checkout trends recorded yet</span>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8192D4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8192D4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="20" y1="30" x2={chartWidth - 20} y2="30" stroke="#EAE3D9" strokeDasharray="4 4" />
                <line x1="20" y1={chartHeight / 2} x2={chartWidth - 20} y2={chartHeight / 2} stroke="#EAE3D9" strokeDasharray="4 4" />
                <line x1="20" y1={chartHeight - 30} x2={chartWidth - 20} y2={chartHeight - 30} stroke="#EAE3D9" strokeDasharray="4 4" />

                {/* Area and Line */}
                <path d={areaPath} fill="url(#revenueGradient)" />
                <path d={svgPath} fill="none" stroke="#8192D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Point Indicators */}
                {points.map((p, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#8192D4" strokeWidth="2.5" />
                    <title>{`${p.date}: ₹${p.revenue.toLocaleString("en-IN")}`}</title>
                  </g>
                ))}
              </svg>
              <div className="flex justify-between text-[11px] text-dusty-taupe font-mono pt-1 px-4">
                <span>{points[0]?.date || ""}</span>
                <span>{points[points.length - 1]?.date || ""}</span>
              </div>
            </div>
          )}
        </div>

        {/* Category Sales Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl border border-warm-grey-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-semibold text-charcoal flex items-center gap-2">
              <PieChart className="w-5 h-5 text-soft-lavender-600" /> Category Performance
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            {categorySales.length === 0 ? (
              <div className="py-8 text-center text-xs text-dusty-taupe">No category sales recorded yet</div>
            ) : (
              categorySales.slice(0, 5).map((cat) => {
                const pct = Math.round((cat.revenue / maxCatRevenue) * 100);
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-charcoal">{cat.category}</span>
                      <span className="text-soft-lavender-700 font-bold">₹{cat.revenue.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-2 w-full bg-cream-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-soft-lavender-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Customer Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-warm-grey-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-serif font-semibold text-charcoal flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-soft-lavender-600" /> Recent Customer Orders
              </h3>
              <p className="text-xs text-dusty-taupe mt-0.5">Live activity across customer checkout sessions</p>
            </div>
            <button
              onClick={() => setTab("orders")}
              className="text-xs font-semibold text-soft-lavender-600 hover:text-soft-lavender-700"
            >
              View All Orders →
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-dusty-taupe">
              <div className="text-3xl mb-2 opacity-40">🛒</div>
              <p className="text-sm font-semibold text-charcoal">No customer orders placed yet</p>
              <p className="text-xs mt-1">Place an order via Checkout to test real-time order tracking.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => {
                const bStyle = getStatusBadgeStyle(o.status || "Processing");
                return (
                  <div
                    key={o.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-cream-50/50 rounded-xl border border-warm-grey-200 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-sm">
                        {o.deliveryAddress?.firstName ? o.deliveryAddress.firstName.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-charcoal">#{o.id}</span>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ color: bStyle.color, backgroundColor: bStyle.bg, border: `1px solid ${bStyle.border}` }}
                          >
                            ● {o.status || "Processing"}
                          </span>
                        </div>
                        <p className="text-xs text-dusty-taupe mt-0.5">
                          {o.deliveryAddress?.firstName} {o.deliveryAddress?.lastName} ({o.deliveryAddress?.email}) · {o.items?.length || 0} item(s)
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-bold text-charcoal">₹{(o.total || o.totalAmount || 0).toLocaleString("en-IN")}</p>
                      <p className="text-[11px] text-dusty-taupe mt-0.5">{o.date || "Today"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Static Product Catalog Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-warm-grey-200 shadow-sm space-y-4">
          <h3 className="text-lg font-serif font-semibold text-charcoal mb-4">Catalog Inventory</h3>
          <div className="space-y-3">
            {["journals", "planners", "pens", "workspace", "accessories"].map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              const pct = Math.round((count / (products.length || 1)) * 100);
              return (
                <div key={cat} className="bg-cream-50/50 p-3 rounded-xl border border-warm-grey-100">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="capitalize text-charcoal">{cat}</span>
                    <span className="text-soft-lavender-700">{count} items ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-warm-grey-200 rounded-full overflow-hidden">
                    <div className="h-full bg-soft-lavender-600 rounded-full" style={{ width: `${pct}%` }} />
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
