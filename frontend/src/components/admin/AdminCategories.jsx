import { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Tag, Check, X, Image as ImageIcon, RefreshCw } from "lucide-react";
import { resolvePinterestImage, normalizeImageUrl } from "../../utils/imageUtils";

export default function AdminCategories({ token, showToast }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", image: "", isActive: true });
  const [submitting, setSubmitting] = useState(false);
  const [resolvingImage, setResolvingImage] = useState(false);

  const handleCatImageUrlChange = async (rawUrl) => {
    setForm((prev) => ({ ...prev, image: rawUrl }));
    const trimmed = rawUrl.trim();
    if (trimmed.includes("pin.it") || trimmed.includes("pinterest.com/pin/")) {
      setResolvingImage(true);
      const resolved = await resolvePinterestImage(trimmed);
      setForm((prev) => ({ ...prev, image: resolved }));
      setResolvingImage(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        showToast("Failed to fetch categories", "error");
      }
    } catch (_err) {
      showToast("Network error fetching categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setForm({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        isActive: category.isActive !== false,
      });
    } else {
      setEditingCategory(null);
      setForm({ name: "", description: "", image: "", isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Category name is required", "error");
      return;
    }
    setSubmitting(true);

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingCategory ? "Category updated successfully!" : "Category created successfully!", "success");
        setIsModalOpen(false);
        fetchCategories();
      } else {
        showToast(data.error || "Operation failed", "error");
      }
    } catch (_err) {
      showToast("Network error saving category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${catId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Category deleted successfully!", "success");
        fetchCategories();
      } else {
        showToast(data.error || "Failed to delete category", "error");
      }
    } catch (_err) {
      showToast("Network error deleting category", "error");
    }
  };

  const filteredCategories = categories.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-warm-grey-200 shadow-sm">
        <div>
          <h2 className="text-xl font-serif text-charcoal font-semibold flex items-center gap-2">
            <Tag className="w-5 h-5 text-soft-lavender-600" /> Category Management
          </h2>
          <p className="text-sm text-dusty-taupe font-sans mt-0.5">
            Organize product categories, imagery, and catalog taxonomy.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchCategories}
            className="p-2.5 text-dusty-taupe hover:text-charcoal border border-warm-grey-200 rounded-xl hover:bg-cream-100 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-soft-lavender-600 text-white font-medium rounded-xl hover:bg-soft-lavender-700 transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-warm-grey-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-warm-grey-100 bg-cream-50/50">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-dusty-taupe" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-dusty-taupe text-sm">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-dusty-taupe text-sm">No categories found matching search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-charcoal">
              <thead className="bg-warm-grey-50 text-xs uppercase tracking-wider text-dusty-taupe border-b border-warm-grey-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Slug</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-grey-100">
                {filteredCategories.map((c) => (
                  <tr key={c.id || c._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="w-10 h-10 object-cover rounded-lg border border-warm-grey-200" />
                        ) : (
                          <div className="w-10 h-10 bg-warm-grey-100 rounded-lg flex items-center justify-center text-dusty-taupe">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-charcoal block">{c.name}</span>
                          <span className="text-xs text-dusty-taupe">{c.productCount || 0} products</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-dusty-taupe">{c.slug}</td>
                    <td className="px-6 py-4 text-dusty-taupe max-w-xs truncate">{c.description || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          c.isActive !== false ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-warm-grey-100 text-dusty-taupe"
                        }`}
                      >
                        {c.isActive !== false ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {c.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(c)}
                          className="p-1.5 text-dusty-taupe hover:text-soft-lavender-700 hover:bg-soft-lavender-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 text-dusty-taupe hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-warm-grey-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-warm-grey-100">
              <h3 className="text-lg font-serif font-semibold text-charcoal">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-dusty-taupe hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Journals & Planners"
                  className="w-full px-3 py-2 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-charcoal">Image URL (Pinterest supported)</label>
                  {resolvingImage && <span className="text-xs text-soft-lavender-600 font-medium">✨ Resolving Pinterest Image...</span>}
                </div>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => handleCatImageUrlChange(e.target.value)}
                  onBlur={(e) => handleCatImageUrlChange(e.target.value)}
                  placeholder="Paste direct URL or Pinterest link (e.g. pin.it/...)"
                  className="w-full px-3 py-2 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
                />
                {form.image && (
                  <div className="mt-2.5 flex items-center gap-3 p-2 bg-cream-50 rounded-xl border border-warm-grey-200">
                    <img
                      src={normalizeImageUrl(form.image)}
                      alt="Category Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                      }}
                      className="w-12 h-12 object-cover rounded-lg bg-warm-grey-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-charcoal truncate">
                        {form.image.includes("pinimg.com") ? "📌 Pinterest High-Res Image" : "Live Image Preview"}
                      </p>
                      <p className="text-[10px] text-dusty-taupe truncate">{form.image}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short category description..."
                  className="w-full px-3 py-2 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-warm-grey-300 text-soft-lavender-600 focus:ring-soft-lavender-400"
                />
                <label htmlFor="isActive" className="text-sm text-charcoal font-medium">
                  Active (Visible on storefront)
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
                  {submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
