import { Divider } from "../ui";

export function AdminOrders({
  orders = [],
  loadingOrders = false,
  filteredAdminOrders = [],
  adminOrderFilter = "all",
  setAdminOrderFilter,
  processingCount = 0,
  shippedCount = 0,
  deliveredCount = 0,
  cancelledCount = 0,
  fetchOrders,
  addToast,
  getStatusBadgeStyle,
  handleUpdateOrderStatus,
  handleDeleteSingleOrder,
}) {
  return (
    <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 24, border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>Customer Orders Fulfillment</h3>
          <p style={{ fontSize: 13, color: "#9C968D", marginTop: 2 }}>Track orders, update fulfillment status in real-time, and inspect customer addresses.</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { fetchOrders(); addToast("Refreshed orders list"); }} className="btn" style={{ background: "#FAF7F2", border: "1px solid #EAE3D9", color: "#23201D", padding: "8px 16px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
            🔄 Refresh Orders
          </button>
        </div>
      </div>

      {/* Order Status Category Filter Bars */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { id: "all", label: `All Orders (${orders.length})` },
          { id: "processing", label: `Processing 🟡 (${processingCount})` },
          { id: "shipped", label: `Shipped 🔵 (${shippedCount})` },
          { id: "delivered", label: `Delivered 🟢 (${deliveredCount})` },
          { id: "cancelled", label: `Cancelled 🔴 (${cancelledCount})` },
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setAdminOrderFilter(st.id)}
            style={{
              background: adminOrderFilter === st.id ? "#23201D" : "#FAF7F2",
              color: adminOrderFilter === st.id ? "#FAF7F2" : "#6E6A63",
              border: `1.5px solid ${adminOrderFilter === st.id ? "#23201D" : "#EAE3D9"}`,
              borderRadius: 999,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              boxShadow: adminOrderFilter === st.id ? "0 4px 12px rgba(35,32,29,0.12)" : "none",
            }}
          >
            {st.label}
          </button>
        ))}
      </div>

      {loadingOrders ? (
        <div style={{ padding: 40, textAlign: "center", color: "#9C968D" }}>Loading live orders...</div>
      ) : filteredAdminOrders.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center", background: "#FAF7F2", borderRadius: 20, border: "1px dashed #EAE3D9" }}>
          <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📦</div>
          <h4 style={{ fontSize: 16, fontWeight: 800, color: "#23201D" }}>No {adminOrderFilter !== "all" ? adminOrderFilter : ""} orders found</h4>
          <p style={{ fontSize: 13, color: "#9C968D", marginTop: 4 }}>There are currently no orders in this status category.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {filteredAdminOrders.map((o) => {
            const bStyle = getStatusBadgeStyle(o.status || "Processing");
            return (
              <div key={o.id} style={{ border: "1px solid #EAE3D9", borderRadius: 20, padding: 24, background: "#FAF7F2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#AB88CD", letterSpacing: "1px" }}>ORDER ID</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: bStyle.color, background: bStyle.bg, border: `1px solid ${bStyle.border}`, padding: "2px 10px", borderRadius: 999 }}>
                        ● {o.status || "Processing"}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 18, fontWeight: 800, color: "#23201D", fontFamily: "monospace", marginTop: 4 }}>#{o.id}</h4>
                    <p style={{ fontSize: 12, color: "#9C968D", marginTop: 2 }}>Placed on {o.date || "Today"}</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFFFFF", padding: "8px 14px", borderRadius: 12, border: "1px solid #EAE3D9" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#23201D" }}>Update Status:</span>
                      <select
                        value={o.status || "Processing"}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 8,
                          border: `1.5px solid ${bStyle.color}`,
                          background: bStyle.bg,
                          fontSize: 13,
                          fontWeight: 800,
                          color: bStyle.color,
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleDeleteSingleOrder(o.id)}
                      title="Delete Order"
                      style={{
                        background: "#FDF2F2",
                        color: "#DC2626",
                        border: "1px solid #F8B4B4",
                        padding: "8px 14px",
                        borderRadius: 12,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <Divider margin={14} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1px", marginBottom: 6 }}>DELIVERY ADDRESS</p>
                    <p style={{ fontSize: 13, color: "#23201D", lineHeight: 1.6 }}>
                      <strong>{o.deliveryAddress?.firstName} {o.deliveryAddress?.lastName}</strong><br />
                      {o.deliveryAddress?.email}<br />
                      {o.deliveryAddress?.address}, {o.deliveryAddress?.city}<br />
                      Phone: {o.deliveryAddress?.phone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1px", marginBottom: 6 }}>ORDER SUMMARY</p>
                    <p style={{ fontSize: 13, color: "#23201D", lineHeight: 1.6 }}>
                      Payment Method: <span style={{ fontWeight: 800, textTransform: "uppercase" }}>{o.payMethod}</span><br />
                      Total Amount: <strong style={{ fontSize: 16, color: "#AB88CD" }}>&#8377;{o.total?.toLocaleString("en-IN")}</strong>
                    </p>
                  </div>
                </div>

                {o.items && o.items.length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px dashed #EAE3D9" }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1px", marginBottom: 10 }}>ORDERED ITEMS ({o.items.length})</p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {o.items.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFFFFF", padding: "6px 12px", borderRadius: 12, border: "1px solid #EAE3D9", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
                          {item.product?.images?.[0] && (
                            <img src={item.product.images[0]} alt={item.product.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", border: "1px solid #EAE3D9" }} />
                          )}
                          <div>
                            <p style={{ fontSize: 12.5, fontWeight: 700, color: "#23201D" }}>{item.product?.name || "Product"}</p>
                            <p style={{ fontSize: 11, color: "#9C968D" }}>&#8377;{item.product?.price || 0}</p>
                          </div>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: "#AB88CD", background: "rgba(171, 136, 205,0.12)", padding: "2px 8px", borderRadius: 6, marginLeft: 4 }}>
                            x{item.qty || 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
