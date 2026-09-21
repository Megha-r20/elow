import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Icons, Divider } from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import { useCart, useToast } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../api/config";
import { ReviewModal } from "../components/ReviewModal";

const T = { teal: "#8192D4", txt: "#23201D", muted: "#6E6A63", light: "#9C968D", border: "#EAE3D9", sand: "#F4EFE6", cream: "#FAF7F2" };

export default function OrderConfirmation() {
    const navigate = useNavigate();
    const { lastOrder } = useCart();
    const { user, token, authFetch } = useAuth();
    const { addToast } = useToast();
    const [show, setShow] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(lastOrder);
    const [recommended, setRecommended] = useState([]);

    // Review Modal State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewProduct, setReviewProduct] = useState(null);
    useEffect(() => {
        const t = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(t);
    }, []);
    // Fetch live status from backend API using GET /api/orders/:id
    useEffect(() => {
        if (!lastOrder?.id)
            return;

        const isTerminalStatus = (status) => {
            const s = (status || "").toLowerCase();
            return s === "delivered" || s === "cancelled";
        };

        let timer = null;

        const fetchLiveStatus = async () => {
            try {
                const res = await authFetch(getApiUrl(`/api/orders/${lastOrder.id}`));
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.id) {
                        setCurrentOrder(data);
                        if (isTerminalStatus(data.status) && timer) {
                            clearInterval(timer);
                        }
                    }
                }
            }
            catch (_err) {
                /* ignore status fetch error */
            }
        };

        fetchLiveStatus();

        const activeStatus = currentOrder?.status || lastOrder?.status || "";
        if (!isTerminalStatus(activeStatus)) {
            timer = setInterval(fetchLiveStatus, 5000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [lastOrder, authFetch, currentOrder?.status]);

    useEffect(() => {
        async function fetchRecommended() {
            try {
                const res = await fetch(getApiUrl("/api/products?filter=bestseller&limit=4"));
                if (res.ok) {
                    const data = await res.json();
                    setRecommended(data.products || []);
                }
            } catch (_err) {
                /* ignore fetch error */
            }
        }
        fetchRecommended();
    }, []);
    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const activeOrder = currentOrder || lastOrder;
    const orderId = activeOrder?.id ?? `US-${new Date().getFullYear()}-DEMO88`;
    const items = activeOrder?.items ?? [];
    const address = activeOrder?.deliveryAddress;
    const orderStatus = (activeOrder?.status || "Processing").trim();
    // Helper to determine step completion
    const isCancelled = orderStatus.toLowerCase() === "cancelled";
    const isProcessing = orderStatus.toLowerCase() === "processing" || orderStatus.toLowerCase() === "order placed";
    const isShipped = orderStatus.toLowerCase() === "shipped";
    const isDelivered = orderStatus.toLowerCase() === "delivered";
    // Step indexes: 0 = Placed, 1 = Packing/Processing, 2 = Shipped, 3 = Delivered
    const activeStepIndex = isDelivered ? 3 : isShipped ? 2 : isProcessing ? 1 : 0;
    const handleCancelOrder = async () => {
        if (!orderId)
            return;
        if (!window.confirm(`Are you sure you want to cancel Order #${orderId}?`))
            return;
        try {
            const res = await authFetch(getApiUrl(`/api/orders/${orderId}/cancel`), { method: "PATCH" });
            const data = await res.json();
            if (res.ok && data.order) {
                addToast(`Order #${orderId} has been cancelled`, "info");
                setCurrentOrder(data.order);
            }
            else {
                addToast(data.error || "Failed to cancel order", "error");
            }
        }
        catch (err) {
            addToast("Network error cancelling order", "error");
        }
    };
    return (<div style={{ background: T.cream, minHeight: "100vh" }}>
      {/* Success header */}
      <div style={{ background: "linear-gradient(135deg, #edfcfa 0%, #f5f0e8 100%)", padding: "64px 0 52px", textAlign: "center", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{
            width: 76, height: 76, borderRadius: "50%", background: isCancelled ? "#DC2626" : T.teal,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 0 ${show ? "16px" : "0"} ${isCancelled ? "rgba(220,38,38,0.14)" : "rgba(61,189,181,0.14)"}`,
            transition: "box-shadow 0.6s ease 0.3s",
        }}>
            <span style={{ color: "#fff", fontSize: 34 }}>{isCancelled ? "✕" : "✓"}</span>
          </div>
        </div>

        <h1 className="font-display" style={{ fontSize: 44, color: T.txt, marginBottom: 10, lineHeight: 1.1 }}>
          {isCancelled ? "Order Cancelled" : "Order Confirmed!"}
        </h1>
        <p style={{ fontSize: 15.5, color: T.muted, marginBottom: 20, lineHeight: 1.75, maxWidth: 480, margin: "0 auto 20px" }}>
          {isCancelled
            ? `Order ${orderId} has been marked as cancelled. If you have questions, please contact support.`
            : `Thank you ${address?.firstName ? `${address.firstName} ` : ""}for your order! We've received it and are preparing it with care.`}
        </p>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "12px 24px" }}>
          <Icons.Package />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px" }}>ORDER NUMBER & STATUS</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: T.txt, fontFamily: "monospace" }}>{orderId}</p>
              <span style={{
            fontSize: 11,
            fontWeight: 800,
            padding: "3px 10px",
            borderRadius: 999,
            background: isCancelled ? "#FDF2F2" : isDelivered ? "#F0FDF4" : isShipped ? "#EFF6FF" : "#F2F7F4",
            color: isCancelled ? "#DC2626" : isDelivered ? "#16A34A" : isShipped ? "#2563EB" : "#8192D4",
            border: `1px solid ${isCancelled ? "#F8B4B4" : isDelivered ? "#BBF7D0" : isShipped ? "#BFDBFE" : "#8EBAA3"}`,
        }}>
                ● {orderStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 32px 80px" }}>
        {/* Status timeline */}
        <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "28px 32px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: T.txt }}>Order Progress</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#8192D4" }}>⚡ Live sync with Admin portal</span>
              {isProcessing && (<button onClick={handleCancelOrder} style={{
                background: "#FDF2F2",
                color: "#DC2626",
                border: "1px solid #F8B4B4",
                padding: "6px 14px",
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
            }}>
                  Cancel Order
                </button>)}
            </div>
          </div>

          {isCancelled ? (<div style={{ background: "#FDF2F2", border: "1px solid #F8B4B4", color: "#9B1C1C", borderRadius: 12, padding: "16px 20px", fontWeight: 600, fontSize: 14 }}>
              ⚠️ This order has been cancelled by the store administrator.
            </div>) : (<div style={{ display: "flex", gap: 0 }}>
              {[
                { icon: "✓", label: "Order Placed", sub: "Just now", stepIdx: 0 },
                { icon: "📦", label: "Processing / Packing", sub: isProcessing ? "In Progress" : "Done", stepIdx: 1 },
                { icon: "🚚", label: "Shipped", sub: isShipped || isDelivered ? "Dispatched" : "Within 24 hrs", stepIdx: 2 },
                { icon: "🎉", label: "Delivered", sub: isDelivered ? "Delivered!" : deliveryDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), stepIdx: 3 },
            ].map((s, i) => {
                const isDone = activeStepIndex >= s.stepIdx;
                const isCurrent = activeStepIndex === s.stepIdx;
                return (<div key={s.label} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 100 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: isDone ? T.teal : T.sand,
                        border: `2.5px solid ${isDone ? T.teal : T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        boxShadow: isCurrent ? "0 0 0 6px rgba(129,146,212,0.2)" : "none",
                        transition: "all 0.3s ease",
                    }}>
                        {isDone ? <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>✓</span> : <span>{s.icon}</span>}
                      </div>
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: isDone ? T.txt : T.muted, textAlign: "center" }}>{s.label}</p>
                      <p style={{ fontSize: 11.5, color: isCurrent ? T.teal : T.light, fontWeight: isCurrent ? 700 : 400, textAlign: "center" }}>{s.sub}</p>
                    </div>
                    {i < 3 && (<div style={{
                            flex: 1,
                            height: 3,
                            background: activeStepIndex > i ? T.teal : T.border,
                            marginBottom: 38,
                            transition: "background 0.4s ease",
                        }}/>)}
                  </div>);
            })}
            </div>)}
        </div>

        {/* Order Details & Summary Card */}
        {lastOrder && (<div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, marginBottom: 32 }}>
            {/* Purchased Items */}
            <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "28px" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: T.txt, marginBottom: 18 }}>Items Ordered ({items.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {items.map(({ product: p, qty }) => (<div key={p.id} style={{ display: "flex", gap: 14, alignItems: "center", paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", border: `1px solid ${T.border}` }}/>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: T.txt }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: T.light }}>{p.subcategory} · Qty: {qty}</p>
                    </div>
                    {isDelivered && (
                      <button
                        onClick={() => {
                          setReviewProduct(p);
                          setReviewModalOpen(true);
                        }}
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
                          marginRight: 10
                        }}
                      >
                        ⭐ Write a Review
                      </button>
                    )}
                    <p style={{ fontSize: 14.5, fontWeight: 700, color: T.txt }}>&#8377;{(p.price * qty).toLocaleString("en-IN")}</p>
                  </div>))}
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "28px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 6 }}>SHIPPING ADDRESS</p>
                <p style={{ fontSize: 13.5, color: T.txt, lineHeight: 1.6, fontWeight: 500 }}>
                  {address?.firstName} {address?.lastName}<br />
                  {address?.address}<br />
                  {address?.city}, {address?.state} — {address?.pincode}<br />
                  {address?.phone}
                </p>
              </div>

              <Divider margin={0}/>

              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 6 }}>PAYMENT METHOD</p>
                <p style={{ fontSize: 13.5, color: T.txt, fontWeight: 600 }}>{lastOrder.payMethod.toUpperCase()}</p>
              </div>

              <Divider margin={0}/>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.muted }}>
                  <span>Subtotal</span>
                  <span>&#8377;{lastOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {lastOrder.discount > 0 && (<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#1a7a56" }}>
                    <span>Discount</span>
                    <span>-&#8377;{lastOrder.discount.toLocaleString("en-IN")}</span>
                  </div>)}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.muted }}>
                  <span>Shipping</span>
                  <span>{lastOrder.shipping === 0 ? "FREE" : `₹${lastOrder.shipping}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: T.txt, marginTop: 4 }}>
                  <span>Total Paid</span>
                  <span>&#8377;{lastOrder.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>)}

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 44 }}>
          {[
            {
                icon: <Icons.Truck />,
                title: "Estimated Delivery",
                text: deliveryDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }),
                sub: "Standard delivery · 1–4 working days",
            },
            {
                icon: <Icons.Package />,
                title: "Order Updates",
                text: address?.email ?? "Check your email",
                sub: "We'll send tracking details once your order ships",
            },
            {
                icon: <Icons.Shield />,
                title: "Need Assistance?",
                text: "7-day easy returns",
                sub: "Contact us at support@uniseoul.in",
            },
        ].map(card => (<div key={card.title} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${T.border}`, padding: "20px", display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ color: T.teal }}>{card.icon}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: T.light, letterSpacing: "1.5px", marginBottom: 4 }}>{card.title.toUpperCase()}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: T.txt, marginBottom: 4 }}>{card.text}</p>
                <p style={{ fontSize: 12, color: T.muted }}>{card.sub}</p>
              </div>
            </div>))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 56, flexWrap: "wrap" }}>
          <button className="btn btn-dark btn-xl" onClick={() => navigate("/shop")}>
            Continue Shopping <Icons.ArrowRight />
          </button>
          <button className="btn btn-ghost btn-xl" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>

        {/* You might like */}
        <div>
          <h2 className="font-display" style={{ fontSize: 28, color: T.txt, marginBottom: 20, textAlign: "center" }}>
            You Might Also Love
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {recommended.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        product={reviewProduct}
        orderId={orderId}
        user={user}
      />
    </div>);
}
