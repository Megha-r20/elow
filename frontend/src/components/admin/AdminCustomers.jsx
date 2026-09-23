import { useState, useEffect } from "react";
import { Users, Search, Shield, User, RefreshCw, ShoppingBag, DollarSign } from "lucide-react";
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

const DEFAULT_CUSTOMERS = [
  { id: "user-cust-1", name: "Ritika Sharma", email: "ritika@example.com", role: "user", totalOrders: 3, totalSpent: 2840, createdAt: "2024-07-15T10:00:00Z" },
  { id: "user-admin-1", name: "Elow Admin", email: "admin@elow.com", role: "admin", totalOrders: 0, totalSpent: 0, createdAt: "2024-06-01T08:00:00Z" },
  { id: "user-cust-2", name: "Aanya Kapoor", email: "aanya@example.com", role: "user", totalOrders: 2, totalSpent: 1450, createdAt: "2024-08-02T14:30:00Z" },
  { id: "user-cust-3", name: "Meghna Patel", email: "meghna@example.com", role: "user", totalOrders: 5, totalSpent: 4200, createdAt: "2024-08-20T11:15:00Z" },
];

export default function AdminCustomers({ token, showToast }) {
  const [customers, setCustomers] = useState(() => DEFAULT_CUSTOMERS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = async (query = "") => {
    setLoading(true);
    const qStr = query.trim().toLowerCase();
    const filteredDefault = DEFAULT_CUSTOMERS.filter(c =>
      !qStr || c.name.toLowerCase().includes(qStr) || c.email.toLowerCase().includes(qStr)
    );

    try {
      const q = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
      const res = await fetch(getApiUrl(`/api/admin/users${q}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
        } else {
          setCustomers(filteredDefault);
        }
      } else {
        setCustomers(filteredDefault);
      }
    } catch (_err) {
      setCustomers(filteredDefault);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, token]);

  const handleRoleToggle = async (customer) => {
    const newRole = customer.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Change role for ${customer.name || customer.email} to "${newRole}"?`)) return;

    setUpdatingId(customer.id || customer._id);
    try {
      const res = await fetch(getApiUrl(`/api/admin/users/${customer.id || customer._id}/role`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Role updated to ${newRole}`, "success");
        fetchCustomers(search);
      } else {
        showToast(data.error || "Failed to update role", "error");
      }
    } catch (_err) {
      showToast("Network error updating role", "error");
    } finally {
      setUpdatingId(null);
    }
  };

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
            <Users style={{ width: 20, height: 20, color: T.teal }} /> Customer Directory
          </h2>
          <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
            View registered user profiles, purchase history, total spending, and role privileges.
          </p>
        </div>
        <button
          onClick={() => fetchCustomers(search)}
          className="icon-btn"
          style={{ background: T.sand, borderRadius: 12, padding: 10, border: "none", cursor: "pointer" }}
          title="Refresh"
        >
          <RefreshCw style={{ width: 16, height: 16, color: T.txt }} />
        </button>
      </div>

      {/* Directory Table Card */}
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
          <div style={{ position: "relative", maxWidth: 440 }}>
            <Search style={{ width: 16, height: 16, position: "absolute", left: 12, top: 12, color: T.light }} />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field field-sm"
              style={{ width: "100%", paddingLeft: 36, boxSizing: "border-box" }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: T.muted, fontSize: 14 }}>
            Loading customer directory...
          </div>
        ) : customers.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: T.muted, fontSize: 14 }}>
            No customers found matching search query.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ background: T.cream, borderBottom: `1px solid ${T.border}`, color: T.muted }}>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>CUSTOMER</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>JOINED</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>ORDERS</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>TOTAL SPENT</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>ROLE</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700, textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const isAdmin = c.role === "admin";
                  return (
                    <tr key={c.id || c._id} style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: isAdmin ? "rgba(171, 136, 205, 0.2)" : T.sand,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isAdmin ? T.teal : T.txt,
                              fontWeight: 800,
                              fontSize: 14,
                            }}
                          >
                            {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: T.txt, margin: 0 }}>{c.name || "Customer User"}</p>
                            <p style={{ fontSize: 11, color: T.light, margin: "2px 0 0" }}>{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", color: T.muted }}>
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recently"}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontWeight: 700,
                            color: T.txt,
                          }}
                        >
                          <ShoppingBag style={{ width: 14, height: 14, color: T.teal }} />
                          {c.totalOrders ?? 0}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontWeight: 700,
                            color: "#276749",
                          }}
                        >
                          <DollarSign style={{ width: 14, height: 14 }} />
                          ₹{(c.totalSpent ?? 0).toLocaleString("en-IN")}
                        </span>
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
                            background: isAdmin ? "rgba(171, 136, 205, 0.15)" : T.sand,
                            color: isAdmin ? T.teal : T.muted,
                          }}
                        >
                          {isAdmin ? <Shield style={{ width: 12, height: 12 }} /> : <User style={{ width: 12, height: 12 }} />}
                          {isAdmin ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <button
                          onClick={() => handleRoleToggle(c)}
                          disabled={updatingId === (c.id || c._id)}
                          className="btn btn-sm"
                          style={{
                            background: isAdmin ? T.sand : T.teal,
                            color: isAdmin ? T.txt : "#FFFFFF",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 11,
                            border: "none",
                            cursor: updatingId === (c.id || c._id) ? "wait" : "pointer",
                          }}
                        >
                          {updatingId === (c.id || c._id)
                            ? "Updating..."
                            : isAdmin
                            ? "Demote to User"
                            : "Promote to Admin"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
