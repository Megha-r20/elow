import { useState, useEffect } from "react";
import { useCart, useToast } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { Icons, Divider } from "./ui";
import { useNavigate } from "react-router";

export function AccountModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { lastOrder } = useCart();
  const { user } = useAuth();
  const { addToast }  = useToast();
  const navigate      = useNavigate();
  const [tab, setTab] = useState<"profile" | "orders" | "addresses">("orders");
  const [liveOrder, setLiveOrder] = useState<any>(lastOrder);

  useEffect(() => {
    if (!isOpen || !lastOrder?.id) return;

    const fetchLiveOrder = async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lastOrder),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setLiveOrder(data.order);
          }
        }
      } catch (err) {
        console.error("Error fetching live order in modal:", err);
      }
    };

    fetchLiveOrder();
  }, [isOpen, lastOrder]);

  if (!isOpen) return null;

  const displayOrder = liveOrder || lastOrder;
  const status = displayOrder?.status || "Processing";

  const getStatusStyle = (st: string) => {
    const s = st.toLowerCase();
    if (s === "cancelled") return { color: "#DC2626", bg: "rgba(220,38,38,0.12)" };
    if (s === "delivered") return { color: "#16A34A", bg: "rgba(22,163,74,0.12)" };
    if (s === "shipped")   return { color: "#2563EB", bg: "rgba(37,99,235,0.12)" };
    return { color: "#5E8C77", bg: "rgba(94,140,119,0.12)" };
  };

  const statusStyle = getStatusStyle(status);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 600, backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: 540, maxWidth: "90vw", maxHeight: "85vh", background: "#fff", zIndex: 700,
        borderRadius: 24, boxShadow: "0 24px 72px rgba(35,32,29,0.18)", display: "flex", flexDirection: "column",
        overflow: "hidden", border: "1px solid #EAE3D9"
      }}>
        {/* Header */}
        <div style={{ padding: "20px 28px", borderBottom: "1px solid #EAE3D9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FAF7F2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#23201D", color: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>
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

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #EAE3D9", background: "#fff" }}>
          {[
            { id: "orders", label: "Orders" },
            { id: "addresses", label: "Saved Addresses" },
            { id: "profile", label: "Profile Settings" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                flex: 1, padding: "12px 16px", fontSize: 13, fontWeight: 600,
                border: "none", background: "none", cursor: "pointer", fontFamily: "inherit",
                color: tab === t.id ? "#5E8C77" : "#9C968D",
                borderBottom: `2.5px solid ${tab === t.id ? "#5E8C77" : "transparent"}`,
                transition: "all 0.15s"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {tab === "orders" && (
            <div>
              {displayOrder ? (
                <div style={{ background: "#FAF7F2", borderRadius: 16, border: "1px solid #EAE3D9", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#9C968D", letterSpacing: "1px" }}>ORDER ID</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#23201D", fontFamily: "monospace" }}>{displayOrder.id}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: statusStyle.color, background: statusStyle.bg, padding: "4px 12px", borderRadius: 999 }}>
                      ● {status}
                    </span>
                  </div>
                  <Divider margin={12} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                    {displayOrder.items.map(({ product: p, qty }: { product: any; qty: number }) => (
                      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={p.images[0]} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#23201D" }}>{p.name}</p>
                          <p style={{ fontSize: 11.5, color: "#9C968D" }}>Qty: {qty} · &#8377;{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Divider margin={12} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: 12.5, color: "#6E6A63" }}>Date: {displayOrder.date}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#23201D" }}>Total: &#8377;{displayOrder.total?.toLocaleString("en-IN")}</p>
                  </div>
                  <button onClick={() => { onClose(); navigate("/order-confirmation"); }} className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 14 }}>
                    View Full Order Status →
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📦</div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#23201D" }}>No orders placed yet</p>
                  <p style={{ fontSize: 13, color: "#9C968D", marginTop: 4 }}>Your order history will show up here.</p>
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
                  Ritika Sharma<br />
                  Flat 4B, Orchid Heights, MG Road<br />
                  Mumbai, Maharashtra — 400001<br />
                  Phone: 9876543210
                </p>
              </div>
              <button onClick={() => addToast("Address manager updated", "info")} className="btn btn-ghost btn-sm btn-full">
                + Add New Address
              </button>
            </div>
          )}

          {tab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#9C968D", display: "block", marginBottom: 6 }}>FULL NAME</label>
                <input className="field field-sm" defaultValue="Ritika Sharma" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#9C968D", display: "block", marginBottom: 6 }}>EMAIL</label>
                <input className="field field-sm" defaultValue="ritika@example.com" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#9C968D", display: "block", marginBottom: 6 }}>PHONE</label>
                <input className="field field-sm" defaultValue="9876543210" />
              </div>
              <button onClick={() => { addToast("Profile details saved!"); onClose(); }} className="btn btn-dark btn-md btn-full" style={{ marginTop: 8 }}>
                Save Profile Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
