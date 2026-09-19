import { useState, useEffect } from "react";
import { useCart, useToast } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { Icons, Divider } from "./ui";
import { useNavigate } from "react-router";
import { getApiUrl } from "../api/config";
import { ReviewModal } from "./ReviewModal";

export function AccountModal({ isOpen, onClose }) {
  const { lastOrder, myOrders } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState("orders");
  const [orderFilter, setOrderFilter] = useState("all");
  const [allOrders, setAllOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewOrderId, setReviewOrderId] = useState("");

  const fetchCustomerOrders = async () => {
    setLoadingOrders(true);
    try {
      const email = user?.email || "ritika@example.com";
      const res = await fetch(getApiUrl(`/api/orders/my-orders?email=${encodeURIComponent(email)}`));
      if (res.ok) {
        const data = await res.json();
        const serverOrders = data.orders || [];

        // Combine server orders & local context orders by unique ID
        const combined = [...serverOrders];
        (myOrders || []).forEach((localOrd) => {
          if (!combined.some((o) => o.id === localOrd.id)) {
            combined.push(localOrd);
          }
        });
        if (lastOrder && !combined.some((o) => o.id === lastOrder.id)) {
          combined.unshift(lastOrder);
        }

        // Sort newest first
        combined.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setAllOrders(combined);
      }
    } catch (err) {
      console.error("Error fetching order history:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCustomerOrders();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleCancelOrder = async (id) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${id}?`)) return;
    try {
      const res = await fetch(getApiUrl(`/api/orders/${id}/cancel`), { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        addToast(`Order #${id} has been cancelled`, "info");
        setAllOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o)));
      } else {
        addToast(data.error || "Failed to cancel order", "error");
      }
    } catch (err) {
      addToast("Network error cancelling order", "error");
    }
  };

  const openReviewModal = (product, orderId) => {
    setReviewProduct(product);
    setReviewOrderId(orderId);
    setReviewModalOpen(true);
  };

  const getStatusStyle = (st) => {
    const s = (st || "Processing").toLowerCase();
    if (s === "cancelled") return { color: "#DC2626", bg: "rgba(220,38,38,0.12)" };
    if (s === "delivered") return { color: "#16A34A", bg: "rgba(22,163,74,0.12)" };
    if (s === "shipped") return { color: "#2563EB", bg: "rgba(37,99,235,0.12)" };
    return { color: "#D97706", bg: "rgba(217,119,6,0.12)" };
  };

  // Filter orders based on category sub-tab
  const filteredOrders = allOrders.filter((ord) => {
    const s = (ord.status || "Processing").toLowerCase();
    if (orderFilter === "delivered") return s === "delivered";
    if (orderFilter === "processing") return s === "processing" || s === "order placed" || s === "shipped";
    if (orderFilter === "cancelled") return s === "cancelled";
    return true;
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 600, backdropFilter: "blur(3px)" }}
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 580,
          maxWidth: "92vw",
          maxHeight: "88vh",
          background: "#fff",
          zIndex: 700,
          borderRadius: 24,
          boxShadow: "0 24px 72px rgba(35,32,29,0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #EAE3D9",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid #EAE3D9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FAF7F2",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#5E8C77",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "R"}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#23201D" }}>{user?.name || "Ritika Sharma"}</h3>
              <p style={{ fontSize: 12, color: "#9C968D" }}>{user?.email || "ritika@example.com"}</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 34, height: 34 }}>
            <Icons.Close />
          </button>
        </div>

        {/* Main Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #EAE3D9", background: "#fff" }}>
          {[
            { id: "orders", label: `Order History (${allOrders.length})` },
            { id: "addresses", label: "Saved Addresses" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: "12px 16px",
                fontSize: 13.5,
                fontWeight: 700,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                color: tab === t.id ? "#5E8C77" : "#9C968D",
                borderBottom: `2.5px solid ${tab === t.id ? "#5E8C77" : "transparent"}`,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }} className="hide-scroll">
          {tab === "orders" && (
            <div>
              {/* Filter Sub-Tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { id: "all", label: "All Orders" },
                  { id: "delivered", label: "Delivered 🟢" },
                  { id: "processing", label: "Active / Processing 🟡" },
                  { id: "cancelled", label: "Cancelled 🔴" },
                ].map((ft) => (
                  <button
                    key={ft.id}
                    onClick={() => setOrderFilter(ft.id)}
                    style={{
                      background: orderFilter === ft.id ? "#23201D" : "#F4EFE6",
                      color: orderFilter === ft.id ? "#FAF7F2" : "#6E6A63",
                      border: "none",
                      borderRadius: 999,
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.14s ease",
                    }}
                  >
                    {ft.label}
                  </button>
                ))}
              </div>

              {loadingOrders ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#9C968D" }}>
                  Fetching your complete order history...
                </div>
              ) : filteredOrders.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {filteredOrders.map((ord) => {
                    const status = ord.status || "Processing";
                    const statusStyle = getStatusStyle(status);
                    const isDelivered = status.toLowerCase() === "delivered";
                    const isProcessing = status.toLowerCase() === "processing" || status.toLowerCase() === "order placed";

                    return (
                      <div
                        key={ord.id}
                        style={{
                          background: "#FAF7F2",
                          borderRadius: 18,
                          border: "1px solid #EAE3D9",
                          padding: "18px 20px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <div>
                            <p style={{ fontSize: 10.5, fontWeight: 800, color: "#9C968D", letterSpacing: "1px" }}>ORDER ID</p>
                            <p style={{ fontSize: 14, fontWeight: 800, color: "#23201D", fontFamily: "monospace" }}>{ord.id}</p>
                          </div>
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 800,
                              color: statusStyle.color,
                              background: statusStyle.bg,
                              padding: "4px 12px",
                              borderRadius: 999,
                            }}
                          >
                            ● {status}
                          </span>
                        </div>

                        <Divider margin={10} />

                        {/* Order Items */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                          {ord.items?.map(({ product: p, qty }) => (
                            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <img src={p.images?.[0]} alt={p.name} style={{ width: 46, height: 46, borderRadius: 8, objectFit: "cover" }} />
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#23201D" }}>{p.name}</p>
                                <p style={{ fontSize: 11.5, color: "#9C968D" }}>
                                  Qty: {qty} · &#8377;{p.price}
                                </p>
                              </div>

                              {/* Review Button for Delivered Items */}
                              {isDelivered && (
                                <button
                                  onClick={() => openReviewModal(p, ord.id)}
                                  style={{
                                    background: "#FFF0F5",
                                    color: "#D81B60",
                                    border: "1px solid #FFB6C1",
                                    padding: "6px 12px",
                                    borderRadius: 8,
                                    fontSize: 11.5,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    boxShadow: "0 2px 6px rgba(216, 27, 96, 0.12)",
                                    transition: "all 0.15s ease",
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                >
                                  ⭐ Write a Review
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <Divider margin={10} />

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <p style={{ fontSize: 12, color: "#6E6A63", fontWeight: 500 }}>Date: {ord.date}</p>
                          <p style={{ fontSize: 15, fontWeight: 800, color: "#23201D" }}>
                            Total: &#8377;{ord.total?.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/order-confirmation?orderId=${ord.id}`);
                            }}
                            className="btn btn-ghost btn-sm"
                            style={{ flex: 1, fontSize: 12, fontWeight: 700 }}
                          >
                            View Full Order Status →
                          </button>
                          {isProcessing && (
                            <button
                              onClick={() => handleCancelOrder(ord.id)}
                              style={{
                                background: "#FDF2F2",
                                color: "#DC2626",
                                border: "1px solid #F8B4B4",
                                padding: "6px 14px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📦</div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#23201D" }}>No orders found in this category</p>
                  <p style={{ fontSize: 13, color: "#9C968D", marginTop: 4 }}>Place an order on the storefront to see it here.</p>
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ border: "1.5px solid #5E8C77", background: "#F2F7F4", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#23201D" }}>Default Address</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#5E8C77" }}>Primary</span>
                </div>
                <p style={{ fontSize: 13, color: "#6E6A63", lineHeight: 1.6 }}>
                  {user?.name || "Ritika Sharma"}
                  <br />
                  Flat 4B, Orchid Heights, MG Road
                  <br />
                  Mumbai, Maharashtra — 400001
                  <br />
                  Phone: {user?.phone || "9876543210"}
                </p>
              </div>
              <button onClick={() => addToast("Address manager updated", "info")} className="btn btn-ghost btn-sm btn-full">
                + Add New Address
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        product={reviewProduct}
        orderId={reviewOrderId}
        user={user}
      />
    </>
  );
}
