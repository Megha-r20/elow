import { useState } from "react";
import { Icons } from "../ui";
import { resolvePinterestImage, normalizeImageUrl } from "../../utils/imageUtils";

export function AdminProductModals({
  showAddModal,
  setShowAddModal,
  newProd,
  setNewProd,
  handleAddProduct,
  editingProduct,
  setEditingProduct,
  editForm,
  setEditForm,
  handleUpdateProduct,
}) {
  const [resolvingAdd, setResolvingAdd] = useState(false);
  const [resolvingEdit, setResolvingEdit] = useState(false);

  const handleAddUrlChange = async (rawUrl) => {
    setNewProd((prev) => ({ ...prev, imageUrl: rawUrl }));
    const trimmed = rawUrl.trim();
    if (trimmed.includes("pin.it") || trimmed.includes("pinterest.com/pin/")) {
      setResolvingAdd(true);
      const resolved = await resolvePinterestImage(trimmed);
      setNewProd((prev) => ({ ...prev, imageUrl: resolved }));
      setResolvingAdd(false);
    }
  };

  const handleEditUrlChange = async (rawUrl) => {
    setEditForm((prev) => ({ ...prev, imageUrl: rawUrl }));
    const trimmed = rawUrl.trim();
    if (trimmed.includes("pin.it") || trimmed.includes("pinterest.com/pin/")) {
      setResolvingEdit(true);
      const resolved = await resolvePinterestImage(trimmed);
      setEditForm((prev) => ({ ...prev, imageUrl: resolved }));
      setResolvingEdit(false);
    }
  };

  const onAddSubmit = (e) => {
    if (newProd.imageUrl) {
      newProd.imageUrl = normalizeImageUrl(newProd.imageUrl);
    }
    handleAddProduct(e);
  };

  const onEditSubmit = (e) => {
    if (editForm.imageUrl) {
      editForm.imageUrl = normalizeImageUrl(editForm.imageUrl);
    }
    handleUpdateProduct(e);
  };

  return (
    <>
      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <>
          <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 800, backdropFilter: "blur(4px)" }} />
          <div role="dialog" aria-modal="true" aria-label="Add New Product" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 520, maxWidth: "92vw", maxHeight: "90vh", background: "#FFFFFF", zIndex: 850, borderRadius: 24, padding: 28, overflowY: "auto", border: "1px solid #EAE3D9", boxShadow: "0 24px 64px rgba(35,32,29,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#AB88CD", letterSpacing: "1px" }}>INVENTORY</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>+ Add New Product</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 34, height: 34, border: "none", cursor: "pointer" }} aria-label="Close add product modal">
                <Icons.Close />
              </button>
            </div>

            <form onSubmit={onAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PRODUCT NAME *</label>
                <input type="text" required placeholder="e.g. Glass Dip Pen Set" value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>CATEGORY</label>
                  <select value={newProd.category} onChange={(e) => setNewProd({ ...newProd, category: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}>
                    <option value="journals">Journals</option>
                    <option value="planners">Planners</option>
                    <option value="pens">Pens &amp; Ink</option>
                    <option value="washi">Washi Tape</option>
                    <option value="stickers">Stickers</option>
                    <option value="workspace">Workspace</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>SUBCATEGORY</label>
                  <input type="text" placeholder="e.g. Calligraphy" value={newProd.subcategory} onChange={(e) => setNewProd({ ...newProd, subcategory: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PRICE (₹) *</label>
                  <input type="number" required placeholder="1299" value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>ORIGINAL PRICE (₹)</label>
                  <input type="number" placeholder="1599" value={newProd.originalPrice} onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>STOCK COUNT</label>
                  <input type="number" min="0" placeholder="10" value={newProd.stockCount} onChange={(e) => setNewProd({ ...newProd, stockCount: e.target.value, inStock: Number(e.target.value) > 0 })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span>IMAGE URL (Pinterest supported)</span>
                  {resolvingAdd && <span style={{ fontSize: 11, color: "#AB88CD", fontWeight: 600 }}>✨ Resolving Pinterest Image...</span>}
                </label>
                <input
                  type="text"
                  placeholder="Paste direct URL or Pinterest link (e.g. pin.it/6eCArwtON)"
                  value={newProd.imageUrl}
                  onChange={(e) => handleAddUrlChange(e.target.value)}
                  onBlur={(e) => handleAddUrlChange(e.target.value)}
                  className="field field-sm"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />

                {/* Live Image Preview */}
                {newProd.imageUrl && (
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#FAF7F2", borderRadius: 12, border: "1px solid #EAE3D9" }}>
                    <img
                      src={normalizeImageUrl(newProd.imageUrl)}
                      alt="Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                      }}
                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, background: "#EAE3D9" }}
                    />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#23201D", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {newProd.imageUrl.includes("pinimg.com") ? "📌 Pinterest High-Res Image" : "Live Image Preview"}
                      </p>
                      <p style={{ fontSize: 10, color: "#6E6A63", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {newProd.imageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>DESCRIPTION</label>
                <textarea rows={3} placeholder="Write a short description..." value={newProd.description} onChange={(e) => setNewProd({ ...newProd, description: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={newProd.inStock} onChange={(e) => setNewProd({ ...newProd, inStock: e.target.checked })} />
                  In Stock
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={newProd.isNew} onChange={(e) => setNewProd({ ...newProd, isNew: e.target.checked })} />
                  New Arrival
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={newProd.isBestseller} onChange={(e) => setNewProd({ ...newProd, isBestseller: e.target.checked })} />
                  Bestseller
                </label>
              </div>

              <button type="submit" disabled={resolvingAdd} className="btn" style={{ background: "#AB88CD", color: "#FFFFFF", padding: "14px", borderRadius: 12, fontWeight: 700, border: "none", marginTop: 12, cursor: resolvingAdd ? "wait" : "pointer" }}>
                {resolvingAdd ? "Resolving Pinterest Image..." : "Add Product to Store Catalog"}
              </button>
            </form>
          </div>
        </>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <>
          <div onClick={() => setEditingProduct(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 800, backdropFilter: "blur(4px)" }} />
          <div role="dialog" aria-modal="true" aria-label="Edit Product" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 520, maxWidth: "92vw", maxHeight: "90vh", background: "#FFFFFF", zIndex: 850, borderRadius: 24, padding: 28, overflowY: "auto", border: "1px solid #EAE3D9", boxShadow: "0 24px 64px rgba(35,32,29,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#AB88CD", letterSpacing: "1px" }}>EDIT PRODUCT</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>Edit #{editingProduct.id}</h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 34, height: 34, border: "none", cursor: "pointer" }} aria-label="Close edit product modal">
                <Icons.Close />
              </button>
            </div>

            <form onSubmit={onEditSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PRODUCT NAME *</label>
                <input type="text" required placeholder="Product name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>CATEGORY</label>
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}>
                    <option value="journals">Journals</option>
                    <option value="planners">Planners</option>
                    <option value="pens">Pens &amp; Ink</option>
                    <option value="washi">Washi Tape</option>
                    <option value="stickers">Stickers</option>
                    <option value="workspace">Workspace</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>SUBCATEGORY</label>
                  <input type="text" placeholder="Subcategory" value={editForm.subcategory} onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PRICE (₹) *</label>
                  <input type="number" required placeholder="Price" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>ORIGINAL PRICE (₹)</label>
                  <input type="number" placeholder="Original price" value={editForm.originalPrice} onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>STOCK COUNT</label>
                  <input type="number" min="0" placeholder="Stock count" value={editForm.stockCount} onChange={(e) => setEditForm({ ...editForm, stockCount: e.target.value, inStock: Number(e.target.value) > 0 })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span>IMAGE URL (Pinterest supported)</span>
                  {resolvingEdit && <span style={{ fontSize: 11, color: "#AB88CD", fontWeight: 600 }}>✨ Resolving Pinterest Image...</span>}
                </label>
                <input
                  type="text"
                  placeholder="Paste direct URL or Pinterest link (e.g. pin.it/6eCArwtON)"
                  value={editForm.imageUrl}
                  onChange={(e) => handleEditUrlChange(e.target.value)}
                  onBlur={(e) => handleEditUrlChange(e.target.value)}
                  className="field field-sm"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />

                {/* Live Image Preview */}
                {editForm.imageUrl && (
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#FAF7F2", borderRadius: 12, border: "1px solid #EAE3D9" }}>
                    <img
                      src={normalizeImageUrl(editForm.imageUrl)}
                      alt="Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                      }}
                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, background: "#EAE3D9" }}
                    />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#23201D", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {editForm.imageUrl.includes("pinimg.com") ? "📌 Pinterest High-Res Image" : "Live Image Preview"}
                      </p>
                      <p style={{ fontSize: 10, color: "#6E6A63", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {editForm.imageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>DESCRIPTION</label>
                <textarea rows={3} placeholder="Description..." value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={editForm.inStock} onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })} />
                  In Stock
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={editForm.isNew} onChange={(e) => setEditForm({ ...editForm, isNew: e.target.checked })} />
                  New Arrival
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={editForm.isBestseller} onChange={(e) => setEditForm({ ...editForm, isBestseller: e.target.checked })} />
                  Bestseller
                </label>
              </div>

              <button type="submit" disabled={resolvingEdit} className="btn" style={{ background: "#AB88CD", color: "#FFFFFF", padding: "14px", borderRadius: 12, fontWeight: 700, border: "none", marginTop: 12, cursor: resolvingEdit ? "wait" : "pointer" }}>
                {resolvingEdit ? "Resolving Pinterest Image..." : "Save Product Changes"}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
