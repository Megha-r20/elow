import { useState, useEffect } from "react";
import { Users, Search, Shield, User, RefreshCw, ShoppingBag, DollarSign } from "lucide-react";

export default function AdminCustomers({ token, showToast }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = async (query = "") => {
    setLoading(true);
    try {
      const q = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
      const res = await fetch(`/api/admin/users${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      } else {
        showToast("Failed to fetch customer directory", "error");
      }
    } catch (_err) {
      showToast("Network error fetching customers", "error");
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
      const res = await fetch(`/api/admin/users/${customer.id || customer._id}/role`, {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-warm-grey-200 shadow-sm">
        <div>
          <h2 className="text-xl font-serif text-charcoal font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-soft-lavender-600" /> Customer Directory
          </h2>
          <p className="text-sm text-dusty-taupe font-sans mt-0.5">
            View registered user profiles, purchase history, total spending, and role privileges.
          </p>
        </div>
        <button
          onClick={() => fetchCustomers(search)}
          className="p-2.5 text-dusty-taupe hover:text-charcoal border border-warm-grey-200 rounded-xl hover:bg-cream-100 transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-warm-grey-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-warm-grey-100 bg-cream-50/50">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-dusty-taupe" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-dusty-taupe text-sm">Loading customer directory...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-dusty-taupe text-sm">No customers found matching search query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-charcoal">
              <thead className="bg-warm-grey-50 text-xs uppercase tracking-wider text-dusty-taupe border-b border-warm-grey-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Contact Info</th>
                  <th className="px-6 py-3 font-semibold">Orders</th>
                  <th className="px-6 py-3 font-semibold">Total Spent</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-grey-100">
                {customers.map((user) => {
                  const uid = user.id || user._id;
                  const isUpdating = updatingId === uid;
                  return (
                    <tr key={uid} className="hover:bg-cream-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-soft-lavender-100 text-soft-lavender-700 font-bold flex items-center justify-center text-sm border border-soft-lavender-200">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              (user.name || user.email || "U").charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-charcoal block">{user.name || "Customer"}</span>
                            <span className="text-xs text-dusty-taupe">Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-mono text-charcoal">{user.email}</div>
                        {user.phone && <div className="text-dusty-taupe mt-0.5">{user.phone}</div>}
                      </td>
                      <td className="px-6 py-4 font-medium text-charcoal">
                        <div className="flex items-center gap-1.5 text-xs text-charcoal">
                          <ShoppingBag className="w-3.5 h-3.5 text-dusty-taupe" />
                          <span>{user.orderCount || 0} orders</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-700">
                        <div className="flex items-center gap-1 text-xs">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span>₹{(user.totalSpent || 0).toLocaleString("en-IN")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-warm-grey-100 text-dusty-taupe border border-warm-grey-200"
                          }`}
                        >
                          {user.role === "admin" ? <Shield className="w-3 h-3 text-purple-600" /> : <User className="w-3 h-3" />}
                          {user.role === "admin" ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRoleToggle(user)}
                          disabled={isUpdating}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-warm-grey-200 text-dusty-taupe hover:text-charcoal hover:bg-cream-100 disabled:opacity-50 transition-colors"
                        >
                          {isUpdating ? "Updating..." : user.role === "admin" ? "Demote to User" : "Make Admin"}
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
