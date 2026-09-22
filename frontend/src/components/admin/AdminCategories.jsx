import { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Tag, Check, X, RefreshCw } from "lucide-react";
import { resolvePinterestImage, normalizeImageUrl } from "../../utils/imageUtils";
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
      const res = await fetch(getApiUrl("/api/admin/categories"), {
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
      const url = editingCategory
        ? getApiUrl(`/api/admin/categories/${editingCategory.id}`)
        : getApiUrl("/api/admin/categories");
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
      const res = await fetch(getApiUrl(`/api/admin/categories/${catId}`), {
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

  const filteredCategories = categories.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase())
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
            <Tag style={{ width: 20, height: 20, color: T.teal }} /> Category Management
          </h2>
          <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
            Organize product categories, imagery, and catalog taxonomy.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={fetchCategories}
            className="icon-btn"
            style={{ background: T.sand, borderRadius: 12, padding: 10, border: "none", cursor: "pointer" }}
            title="Refresh"
          >
            <RefreshCw style={{ width: 16, height: 16, color: T.txt }} />
          </button>
          <button
            onClick={() => handleOpenModal()}
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
            <Plus style={{ width: 16, height: 16 }} /> Add Category
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
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field field-sm"
              style={{ width: "100%", paddingLeft: 36, boxSizing: "border-box" }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: T.muted, fontSize: 14 }}>Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: T.muted, fontSize: 14 }}>
            No categories found matching search.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ background: T.cream, borderBottom: `1px solid ${T.border}`, color: T.muted }}>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>CATEGORY</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>SLUG / ID</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>DESCRIPTION</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700, textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id || cat._id} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {cat.image ? (
                          <img
                            src={normalizeImageUrl(cat.image)}
                            alt={cat.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                            }}
                            style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", background: T.sand }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              background: T.sand,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: T.muted,
                            }}
                          >
                            <Tag style={{ width: 20, height: 20 }} />
                          </div>
                        )}
                        <div>
                          <p style={{ fontWeight: 700, color: T.txt, margin: 0 }}>{cat.name}</p>
                          <p style={{ fontSize: 11, color: T.light, margin: "2px 0 0" }}>
                            {cat.productCount ?? 0} Products
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontFamily: "monospace", color: T.muted }}>
                      {cat.slug || cat.id}
                    </td>
                    <td style={{ padding: "14px 20px", color: T.muted, maxWidth: 260 }}>
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {cat.description || "—"}
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
                          background: cat.isActive !== false ? "rgba(171, 136, 205, 0.15)" : T.sand,
                          color: cat.isActive !== false ? T.teal : T.muted,
                        }}
                      >
                        {cat.isActive !== false ? <Check style={{ width: 12, height: 12 }} /> : <X style={{ width: 12, height: 12 }} />}
                        {cat.isActive !== false ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="icon-btn"
                          style={{ background: T.cream, borderRadius: 8, padding: 6, border: `1px solid ${T.border}`, cursor: "pointer" }}
                          title="Edit Category"
                        >
                          <Edit3 style={{ width: 15, height: 15, color: T.txt }} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id || cat._id, cat.name)}
                          className="icon-btn"
                          style={{ background: "#FDEFEF", borderRadius: 8, padding: 6, border: "none", cursor: "pointer" }}
                          title="Delete Category"
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

      {/* Modal */}
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
                <span style={{ fontSize: 11, fontWeight: 800, color: T.teal, letterSpacing: "1px" }}>
                  {editingCategory ? "EDIT CATEGORY" : "NEW CATEGORY"}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: T.txt }}>
                  {editingCategory ? `Edit ${editingCategory.name}` : "Create Category"}
                </h3>
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
                  CATEGORY NAME *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Journals & Planners"
                  className="field field-sm"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.txt }}>IMAGE URL (Pinterest supported)</label>
                  {resolvingImage && <span style={{ fontSize: 11, color: T.teal, fontWeight: 600 }}>✨ Resolving...</span>}
                </div>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => handleCatImageUrlChange(e.target.value)}
                  onBlur={(e) => handleCatImageUrlChange(e.target.value)}
                  placeholder="Paste direct URL or Pinterest link (e.g. pin.it/...)"
                  className="field field-sm"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
                {form.image && (
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: 10,
                      background: T.cream,
                      borderRadius: 12,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <img
                      src={normalizeImageUrl(form.image)}
                      alt="Category Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                      }}
                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, background: T.sand }}
                    />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: T.txt, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {form.image.includes("pinimg.com") ? "📌 Pinterest High-Res Image" : "Live Image Preview"}
                      </p>
                      <p style={{ fontSize: 10, color: T.muted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {form.image}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.txt, display: "block", marginBottom: 6 }}>
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short category description..."
                  className="field field-sm"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" style={{ fontSize: 12.5, fontWeight: 700, color: T.txt, cursor: "pointer" }}>
                  Active (Visible on storefront)
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
                {submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
