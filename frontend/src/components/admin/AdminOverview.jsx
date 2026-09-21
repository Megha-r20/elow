import React from "react";

export function AdminOverview({ orders = [], products = [], setTab, getStatusBadgeStyle }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
      <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 24, border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "#23201D" }}>Recent Customer Orders</h3>
            <p style={{ fontSize: 12.5, color: "#9C968D", marginTop: 2 }}>Live activity across customer checkout sessions</p>
          </div>
          <button onClick={() => setTab("orders")} style={{ fontSize: 12.5, fontWeight: 700, color: "#8192D4", background: "none", border: "none", cursor: "pointer" }}>
            View All Orders →
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#9C968D" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>🛒</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#23201D" }}>No customer orders placed yet</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Place an order via Checkout to test real-time order tracking.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {orders.map((o) => {
              const bStyle = getStatusBadgeStyle(o.status || "Processing");
              return (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#FAF7F2", borderRadius: 16, border: "1px solid #EAE3D9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#23201D", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 }}>
                      {o.deliveryAddress?.firstName ? o.deliveryAddress.firstName.charAt(0).toUpperCase() : "C"}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#23201D", fontFamily: "monospace" }}>#{o.id}</p>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: bStyle.color, background: bStyle.bg, border: `1px solid ${bStyle.border}`, padding: "2px 8px", borderRadius: 999 }}>
                          ● {o.status || "Processing"}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#6E6A63", marginTop: 3 }}>
                        {o.deliveryAddress?.firstName} {o.deliveryAddress?.lastName} ({o.deliveryAddress?.email}) · {o.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#23201D" }}>&#8377;{o.total?.toLocaleString("en-IN")}</p>
                    <p style={{ fontSize: 11.5, color: "#9C968D", marginTop: 2 }}>{o.date || "Today"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 24, border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
        <h3 style={{ fontSize: 19, fontWeight: 800, color: "#23201D", marginBottom: 20 }}>Category Breakdown</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {["journals", "planners", "pens", "workspace", "accessories"].map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const pct = Math.round((count / (products.length || 1)) * 100);
            return (
              <div key={cat} style={{ background: "#FAF7F2", padding: "12px 16px", borderRadius: 14, border: "1px solid #EAE3D9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ textTransform: "capitalize", fontSize: 13.5, fontWeight: 700, color: "#23201D" }}>{cat}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#8192D4" }}>{count} items ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: "#EAE3D9", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#8192D4", borderRadius: 999 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
