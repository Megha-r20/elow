import { useState, useEffect } from "react";
import { Ticket, Plus, Search, Trash2, Check, X, RefreshCw, Calendar, Sparkles } from "lucide-react";

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
      const res = await fetch("/api/admin/promo", {
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
      const res = await fetch("/api/admin/promo", {
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
      const res = await fetch(`/api/admin/promo/${promo._id || promo.id || promo.code}`, {
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
      showToast("Network error updating status", "error");
    }
  };

  const handleDelete = async (promoId, code) => {
    if (!window.confirm(`Are you sure you want to delete promo code "${code}"?`)) return;

    try {
      const res = await fetch(`/api/admin/promo/${promoId}`, {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-warm-grey-200 shadow-sm">
        <div>
          <h2 className="text-xl font-serif text-charcoal font-semibold flex items-center gap-2">
            <Ticket className="w-5 h-5 text-soft-lavender-600" /> Promo Code Admin
          </h2>
          <p className="text-sm text-dusty-taupe font-sans mt-0.5">
            Create discount vouchers, spin-wheel promos, and set minimum order thresholds.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchPromos}
            className="p-2.5 text-dusty-taupe hover:text-charcoal border border-warm-grey-200 rounded-xl hover:bg-cream-100 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-soft-lavender-600 text-white font-medium rounded-xl hover:bg-soft-lavender-700 transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> Create Promo Code
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-warm-grey-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-warm-grey-100 bg-cream-50/50">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-dusty-taupe" />
            <input
              type="text"
              placeholder="Search by promo code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-dusty-taupe text-sm">Loading promo codes...</div>
        ) : filteredPromos.length === 0 ? (
          <div className="p-12 text-center text-dusty-taupe text-sm">No promo codes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-charcoal">
              <thead className="bg-warm-grey-50 text-xs uppercase tracking-wider text-dusty-taupe border-b border-warm-grey-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Code</th>
                  <th className="px-6 py-3 font-semibold">Discount</th>
                  <th className="px-6 py-3 font-semibold">Min Order</th>
                  <th className="px-6 py-3 font-semibold">Expiry</th>
                  <th className="px-6 py-3 font-semibold">Usage</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-grey-100">
                {filteredPromos.map((p) => {
                  const isExpired = p.expiryDate && new Date() > new Date(p.expiryDate);
                  return (
                    <tr key={p._id || p.id || p.code} className="hover:bg-cream-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-soft-lavender-700 bg-soft-lavender-50 px-2.5 py-1 rounded-lg border border-soft-lavender-200">
                            {p.code}
                          </span>
                          {p.code.startsWith("SPIN-") && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> Spin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-charcoal">
                        {p.discountType === "percentage" ? `${p.discountValue}% OFF` : `₹${p.discountValue} OFF`}
                        {p.maxDiscount ? <span className="text-xs text-dusty-taupe block font-normal">(Max ₹{p.maxDiscount})</span> : null}
                      </td>
                      <td className="px-6 py-4 text-xs text-dusty-taupe">
                        {p.minOrderAmount ? `₹${p.minOrderAmount}` : "No min order"}
                      </td>
                      <td className="px-6 py-4 text-xs text-dusty-taupe">
                        {p.expiryDate ? (
                          <div className={`flex items-center gap-1 ${isExpired ? "text-rose-600 font-medium" : ""}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(p.expiryDate).toLocaleDateString()}</span>
                            {isExpired && <span className="text-[10px] bg-rose-100 text-rose-700 px-1 rounded">(Expired)</span>}
                          </div>
                        ) : (
                          "Never"
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-dusty-taupe">
                        {p.isSingleUse ? (
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${p.isUsed ? "bg-warm-grey-100 text-dusty-taupe" : "bg-blue-50 text-blue-700"}`}>
                            {p.isUsed ? "Used (Single Use)" : "Single-Use"}
                          </span>
                        ) : (
                          "Multi-Use"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            p.isActive !== false && !isExpired
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-warm-grey-100 text-dusty-taupe hover:bg-warm-grey-200"
                          }`}
                        >
                          {p.isActive !== false && !isExpired ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {p.isActive !== false && !isExpired ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(p._id || p.id || p.code, p.code)}
                          className="p-1.5 text-dusty-taupe hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-warm-grey-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-warm-grey-100">
              <h3 className="text-lg font-serif font-semibold text-charcoal">Create New Promo Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-dusty-taupe hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Promo Code *</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. WELCOME10"
                  className="w-full px-3 py-2 text-sm uppercase border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isSingleUse"
                  checked={form.isSingleUse}
                  onChange={(e) => setForm({ ...form, isSingleUse: e.target.checked })}
                  className="rounded border-warm-grey-300 text-soft-lavender-600 focus:ring-soft-lavender-400"
                />
                <label htmlFor="isSingleUse" className="text-sm text-charcoal font-medium">
                  Single-Use Only (Deactivates after 1 use)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-warm-grey-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-dusty-taupe hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-medium bg-soft-lavender-600 text-white rounded-xl hover:bg-soft-lavender-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  {submitting ? "Creating..." : "Create Promo Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
