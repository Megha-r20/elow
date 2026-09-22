import { useState, useEffect } from "react";
import { Ticket, Plus, Search, Trash2, Check, X, RefreshCw } from "lucide-react";
import { getApiUrl } from "../../api/config";

const T = {
  border: "#EAE3D9",
  txt: "#23201D",
  muted: "#6E6A63",
  light: "#9C968D",
  sand: "#F4EFE6",
  cream: "#FAF7F2",
  teal: "#AB88CD",
};

export default function AdminPromo({ token, showToast }) {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscount: "",
    expiryDate: "",
    isSingleUse: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/admin/promo"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPromos(data);
      } else {
        showToast("Failed to fetch promo codes", "error");
      }
    } catch (_err) {
      showToast("Network error fetching promo codes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discountValue) {
      showToast("Code and discount value are required", "error");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch(getApiUrl("/api/admin/promo"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Promo code "${form.code.toUpperCase()}" created successfully!`, "success");
        setIsModalOpen(false);
        setForm({
          code: "",
          discountType: "percentage",
          discountValue: 10,
          minOrderAmount: 0,
          maxDiscount: "",
          expiryDate: "",
          isSingleUse: false,
        });
        fetchPromos();
      } else {
        showToast(data.error || "Failed to create promo code", "error");
      }
    } catch (_err) {
      showToast("Network error creating promo code", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (promo) => {
    try {
      const promoId = promo._id || promo.id || promo.code;
      const res = await fetch(getApiUrl(`/api/admin/promo/${promoId}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Promo code ${promo.code} ${!promo.isActive ? "activated" : "deactivated"}`, "success");
        fetchPromos();
      } else {
        showToast(data.error || "Failed to update promo status", "error");
      }
    } catch (_err) {
      showToast("Network error updating promo code", "error");
    }
  };

  const handleDelete = async (promo) => {
    const promoId = promo._id || promo.id || promo.code;
    if (!window.confirm(`Delete promo code "${promo.code}"?`)) return;

    try {
      const res = await fetch(getApiUrl(`/api/admin/promo/${promoId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Promo code deleted successfully!", "success");
        fetchPromos();
      } else {
        showToast(data.error || "Failed to delete promo code", "error");
      }
    } catch (_err) {
      showToast("Network error deleting promo code", "error");
    }
  };

  const filteredPromos = promos.filter((p) =>
    (p.code || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Banner */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 24,
          padding: "20px 24px",
          border: `1px solid ${T.border}`,
          boxShadow: "0 4px 20px rgba(35, 32, 29, 0.04)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.txt, display: "flex", alignItems: "center", gap: 8 }}>
            <Ticket style={{ width: 20, height: 20, color: T.teal }} /> Promo Code Admin
          </h2>
          <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
            Create discount vouchers, spin-wheel promos, and set minimum order thresholds.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={fetchPromos}
            className="icon-btn"
            style={{ background: T.sand, borderRadius: 12, padding: 10, border: "none", cursor: "pointer" }}
            title="Refresh"
          >
            <RefreshCw style={{ width: 16, height: 16, color: T.txt }} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn"
            style={{
              background: T.teal,
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: 12,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus style={{ width: 16, height: 16 }} /> Create Promo Code
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 24,
          border: `1px solid ${T.border}`,
          boxShadow: "0 8px 30px rgba(35, 32, 29, 0.04)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 16, borderBottom: `1px solid ${T.border}`, background: T.cream }}>
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search style={{ width: 16, height: 16, position: "absolute", left: 12, top: 12, color: T.light }} />
            <input
              type="text"
              placeholder="Search by promo code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field field-sm"
              style={{ width: "100%", paddingLeft: 36, boxSizing: "border-box" }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: T.muted, fontSize: 14 }}>
            Loading promo codes...
          </div>
        ) : filteredPromos.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: T.muted, fontSize: 14 }}>
            No promo codes found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ background: T.cream, borderBottom: `1px solid ${T.border}`, color: T.muted }}>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>PROMO CODE</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>DISCOUNT</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>MIN ORDER</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>EXPIRY</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>USAGE</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700, textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromos.map((p) => (
                  <tr key={p._id || p.id || p.code} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            background: T.sand,
                            color: T.txt,
                            fontWeight: 800,
                            fontFamily: "monospace",
                            fontSize: 13,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {p.code}
                        </div>
                        {p.isSingleUse && (
                          <span style={{ fontSize: 10, color: T.teal, fontWeight: 700 }}>SINGLE USE</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: T.txt }}>
                      {p.discountType === "percentage" ? `${p.discountValue}% OFF` : `₹${p.discountValue} OFF`}
                      {p.maxDiscount ? ` (Max ₹${p.maxDiscount})` : ""}
                    </td>
                    <td style={{ padding: "14px 20px", color: T.muted }}>
                      {p.minOrderAmount ? `₹${p.minOrderAmount}` : "No min limit"}
                    </td>
                    <td style={{ padding: "14px 20px", color: T.muted }}>
                      {p.expiryDate
                        ? new Date(p.expiryDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Never expires"}
                    </td>
                    <td style={{ padding: "14px 20px", color: T.muted }}>
                      {p.usedCount ?? 0} Uses
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background: p.isActive !== false ? "rgba(171, 136, 205, 0.15)" : T.sand,
                          color: p.isActive !== false ? T.teal : T.muted,
                        }}
                      >
                        {p.isActive !== false ? <Check style={{ width: 12, height: 12 }} /> : <X style={{ width: 12, height: 12 }} />}
                        {p.isActive !== false ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className="btn btn-sm"
                          style={{
                            background: p.isActive !== false ? T.sand : T.teal,
                            color: p.isActive !== false ? T.txt : "#FFFFFF",
                            borderRadius: 8,
                            padding: "4px 10px",
                            fontSize: 11,
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {p.isActive !== false ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="icon-btn"
                          style={{ background: "#FDEFEF", borderRadius: 8, padding: 6, border: "none", cursor: "pointer" }}
                          title="Delete Promo"
                        >
                          <Trash2 style={{ width: 15, height: 15, color: "#D97762" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <>
          <div
            onClick={() => setIsModalOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 800, backdropFilter: "blur(4px)" }}
          />
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 480,
              maxWidth: "92vw",
              maxHeight: "90vh",
              background: "#FFFFFF",
              zIndex: 850,
              borderRadius: 24,
              padding: 28,
              overflowY: "auto",
              border: `1px solid ${T.border}`,
              boxShadow: "0 24px 64px rgba(35,32,29,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: T.teal, letterSpacing: "1px" }}>DISCOUNT VOUCHER</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: T.txt }}>+ Create Promo Code</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="icon-btn"
                style={{ background: T.sand, borderRadius: "50%", width: 34, height: 34, border: "none", cursor: "pointer" }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.txt, display: "block", marginBottom: 6 }}>
                  PROMO CODE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="field field-sm"
                  style={{ width: "100%", boxSizing: "border-box", fontFamily: "monospace" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.txt, display: "block", marginBottom: 6 }}>
                    DISCOUNT TYPE
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="field field-sm"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.txt, display: "block", marginBottom: 6 }}>
                    DISCOUNT VALUE *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="15"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="field field-sm"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.txt, display: "block", marginBottom: 6 }}>
                    MIN ORDER AMOUNT (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="499"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    className="field field-sm"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.txt, display: "block", marginBottom: 6 }}>
                    MAX DISCOUNT CAP (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="200"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    className="field field-sm"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.txt, display: "block", marginBottom: 6 }}>
                  EXPIRY DATE
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="field field-sm"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="isSingleUse"
                  checked={form.isSingleUse}
                  onChange={(e) => setForm({ ...form, isSingleUse: e.target.checked })}
                />
                <label htmlFor="isSingleUse" style={{ fontSize: 12.5, fontWeight: 700, color: T.txt, cursor: "pointer" }}>
                  Single-use voucher per customer
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn"
                style={{
                  background: T.teal,
                  color: "#FFFFFF",
                  padding: "14px",
                  borderRadius: 12,
                  fontWeight: 700,
                  border: "none",
                  marginTop: 12,
                  cursor: submitting ? "wait" : "pointer",
                }}
              >
                {submitting ? "Creating..." : "Save Promo Code"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
