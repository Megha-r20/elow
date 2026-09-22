import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search, Package, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../api/config";

export default function OrderTracking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);


  const T = {
    purple: "#AB88CD",
    purpleDark: "#9873BB",
    cream: "#FAF7F2",
    sand: "#F4EFE6",
    border: "#EAE3D9",
    txt: "#23201D",
    muted: "#6E6A63",
    light: "#9C968D",
  };

  // Mock tracking lookup data
  const sampleTrackingData = {
    "ELW-9842": {
      id: "ELW-9842",
      date: "18 Sep 2026",
      courier: "BlueDart Express",
      awb: "BLD-984201928",
      estimatedDelivery: "21 Sep 2026",
      status: "In Transit",
      destination: "Mumbai, Maharashtra",
      items: [
        { name: "Pastel Dreams Dotted Journal (A5)", qty: 1, price: "₹899" },
        { name: "Kawaii Aesthetic Washi Tape Set (10 rolls)", qty: 1, price: "₹499" },
      ],
      steps: [
        { title: "Order Placed & Confirmed", date: "18 Sep, 10:30 AM", completed: true },
        { title: "Packed at Warehouse (Mumbai)", date: "18 Sep, 02:15 PM", completed: true },
        { title: "Dispatched via BlueDart", date: "19 Sep, 09:00 AM", completed: true },
        { title: "In Transit to Destination Hub", date: "19 Sep, 02:45 PM", completed: true, current: true },
        { title: "Out for Delivery", date: "Expected 21 Sep", completed: false },
        { title: "Delivered", date: "Expected 21 Sep", completed: false },
      ],
    },
    "ELW-7104": {
      id: "ELW-7104",
      date: "15 Sep 2026",
      courier: "Delhivery Logistics",
      awb: "DLV-71049921",
      estimatedDelivery: "18 Sep 2026",
      status: "Delivered",
      destination: "Bengaluru, Karnataka",
      items: [
        { name: "Japanese Pastel Gel Pens (Set of 6)", qty: 2, price: "₹798" },
      ],
      steps: [
        { title: "Order Placed & Confirmed", date: "15 Sep, 08:20 AM", completed: true },
        { title: "Packed at Warehouse", date: "15 Sep, 11:40 AM", completed: true },
        { title: "Dispatched via Delhivery", date: "15 Sep, 04:00 PM", completed: true },
        { title: "In Transit to Hub", date: "16 Sep, 06:10 AM", completed: true },
        { title: "Out for Delivery", date: "18 Sep, 09:30 AM", completed: true },
        { title: "Delivered Successfully 🎉", date: "18 Sep, 02:15 PM", completed: true, current: true },
      ],
    },
  };

  const { authFetch } = useAuth();

  useEffect(() => {
    if (searchParams.get("id")) {
      handleSearch(null, searchParams.get("id"));
    }
  }, []);

  const handleSearch = async (e, explicitId = null) => {
    if (e) e.preventDefault();
    const queryId = (explicitId || orderId).trim().toUpperCase();
    if (!queryId) return;

    setLoading(true);
    setSearched(true);
    setNotFound(false);

    try {
      const res = await authFetch(getApiUrl(`/api/orders/${queryId}`));
      if (res.ok) {
        const order = await res.json();
        if (order && order.id) {
          const status = order.status || "Processing";
          const isCancelled = status.toLowerCase() === "cancelled";
          const isProcessing = status.toLowerCase() === "processing" || status.toLowerCase() === "order placed";
          const isShipped = status.toLowerCase() === "shipped";
          const isDelivered = status.toLowerCase() === "delivered";

          const dest = order.deliveryAddress?.city && order.deliveryAddress?.state
            ? `${order.deliveryAddress.city}, ${order.deliveryAddress.state}`
            : "Customer Address";

          setActiveOrder({
            id: order.id,
            date: order.date || new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            courier: "BlueDart Express",
            awb: `BLD-${order.id.replace(/[^0-9]/g, "") || "984201928"}`,
            estimatedDelivery: isDelivered ? "Delivered" : "In 1–3 working days",
            status: status,
            destination: dest,
            items: (order.items || []).map(i => ({
              name: i.product?.name || "Stationery Item",
              qty: i.qty || 1,
              price: `₹${(i.product?.price || 0) * (i.qty || 1)}`,
            })),
            steps: [
              { title: "Order Placed & Confirmed", date: order.date || "Just now", completed: true },
              { title: "Packed at Warehouse", date: isProcessing ? "In Progress" : "Done", completed: isProcessing || isShipped || isDelivered, current: isProcessing },
              { title: "Dispatched via Courier", date: isShipped ? "In Transit" : isDelivered ? "Done" : "Pending", completed: isShipped || isDelivered, current: isShipped },
              { title: "Out for Delivery", date: isDelivered ? "Done" : "Pending", completed: isDelivered },
              { title: isCancelled ? "Order Cancelled" : "Delivered", date: isDelivered ? "Delivered" : isCancelled ? "Cancelled" : "Pending", completed: isDelivered || isCancelled, current: isDelivered || isCancelled },
            ],
          });
          setLoading(false);
          return;
        }
      }
    } catch (_err) {
      /* ignore search API error and fallback to mock data */
    }

    if (sampleTrackingData[queryId]) {
      setActiveOrder(sampleTrackingData[queryId]);
      setLoading(false);
    } else {
      setActiveOrder(null);
      setNotFound(true);
      setLoading(false);
    }
  };

  return (
    <div style={{ background: T.cream, minHeight: "100vh", padding: "60px 0 100px" }}>
      <div className="container" style={{ maxWidth: 840, margin: "0 auto", padding: "0 24px" }}>
        
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            color: T.muted,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 32,
            padding: 0,
          }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} /> Back
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(171, 136, 205, 0.12)",
              border: "1px solid rgba(171, 136, 205, 0.3)",
              borderRadius: 999,
              padding: "6px 18px",
              marginBottom: 20,
            }}
          >
            <Package style={{ width: 14, height: 14, color: T.purple }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.purple, letterSpacing: "0.5px" }}>
              LIVE SHIPMENT TRACKING
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 44,
              fontWeight: 400,
              color: T.txt,
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Track Your Order
          </h1>

          <p style={{ fontSize: 16, color: T.muted, maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Enter your Order ID (e.g. ELW-9842) or mobile number below to view real-time delivery status.
          </p>

          {/* Search Form Card */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 24,
              padding: "32px",
              border: `1px solid ${T.border}`,
              boxShadow: "0 8px 30px rgba(35, 32, 29, 0.04)",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Order ID (e.g. ELW-9842)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "13px 18px",
                    borderRadius: 12,
                    border: `1px solid ${T.border}`,
                    background: T.cream,
                    fontSize: 14.5,
                    color: T.txt,
                    outline: "none",
                    minWidth: 200,
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: T.purple,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 12,
                    padding: "13px 28px",
                    fontSize: 14.5,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.15s ease",
                  }}
                >
                  <Search style={{ width: 16, height: 16 }} />
                  {loading ? "Searching..." : "Track Order"}
                </button>
              </div>

              {/* Sample Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", paddingTop: 8 }}>
                <span style={{ fontSize: 12, color: T.light, fontWeight: 500 }}>Try sample IDs:</span>
                {["ELW-9842", "ELW-7104"].map((sampleId) => (
                  <button
                    key={sampleId}
                    type="button"
                    onClick={() => {
                      setOrderId(sampleId);
                      handleSearch(null, sampleId);
                    }}
                    style={{
                      background: T.sand,
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: T.purple,
                      cursor: "pointer",
                    }}
                  >
                    {sampleId}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Not Found Message */}
        {searched && notFound && !activeOrder && (
          <div
            style={{
              background: "#FFF5F5",
              border: "1px solid #FEB2B2",
              color: "#C53030",
              borderRadius: 16,
              padding: "20px 24px",
              textAlign: "center",
              margin: "0 auto 32px",
              maxWidth: 600,
              fontSize: 14.5,
              fontWeight: 600,
            }}
          >
            No order details found for &quot;{orderId}&quot;. Please check the Order ID and try again.
          </div>
        )}

        {/* Active Order Details Card */}
        {activeOrder && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 24,
              padding: "36px 40px",
              border: `1px solid ${T.border}`,
              boxShadow: "0 10px 40px rgba(35, 32, 29, 0.05)",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            {/* Order Summary Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                paddingBottom: 24,
                borderBottom: `1px solid ${T.border}`,
                marginBottom: 32,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: T.txt, fontFamily: "'DM Serif Display', serif" }}>
                    Order #{activeOrder.id}
                  </h2>
                  <span
                    style={{
                      background: activeOrder.status === "Delivered" ? "#E8F5E9" : "rgba(171, 136, 205, 0.15)",
                      color: activeOrder.status === "Delivered" ? "#2E7D32" : T.purple,
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    ● {activeOrder.status}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: T.muted }}>Placed on {activeOrder.date} • Destination: {activeOrder.destination}</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, color: T.light, fontWeight: 600 }}>COURIER PARTNER</p>
                <p style={{ fontSize: 14.5, fontWeight: 700, color: T.txt }}>{activeOrder.courier}</p>
                <p style={{ fontSize: 12, color: T.purple, fontWeight: 600 }}>AWB: {activeOrder.awb}</p>
              </div>
            </div>

            {/* Timeline Progress */}
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: T.txt, marginBottom: 24 }}>
                Shipment Journey Timeline
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
                {activeOrder.steps.map((step, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                    {/* Circle Icon */}
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: step.completed ? T.purple : T.sand,
                          color: step.completed ? "#FFFFFF" : T.light,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: "bold",
                          zIndex: 2,
                        }}
                      >
                        {step.completed ? "✓" : idx + 1}
                      </div>
                      {idx < activeOrder.steps.length - 1 && (
                        <div
                          style={{
                            width: 2,
                            height: 32,
                            background: step.completed ? T.purple : T.border,
                            marginTop: 4,
                          }}
                        />
                      )}
                    </div>

                    {/* Step details */}
                    <div style={{ paddingTop: 3 }}>
                      <h4
                        style={{
                          fontSize: 15,
                          fontWeight: step.current ? 800 : 600,
                          color: step.completed ? T.txt : T.light,
                        }}
                      >
                        {step.title}
                      </h4>
                      <p style={{ fontSize: 12.5, color: step.completed ? T.muted : T.light, marginTop: 2 }}>
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div style={{ background: T.cream, borderRadius: 16, padding: "20px 24px", border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.muted, marginBottom: 12 }}>PACKAGE CONTENTS</p>
              {activeOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: T.txt, fontWeight: 600, padding: "6px 0" }}>
                  <span>{item.name} × {item.qty}</span>
                  <span>{item.price}</span>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
