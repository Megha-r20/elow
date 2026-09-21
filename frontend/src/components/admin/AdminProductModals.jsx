import React from "react";
import { Icons } from "../ui";

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
  return (
    <>
      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <>
          <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 800, backdropFilter: "blur(4px)" }} />
          <div role="dialog" aria-modal="true" aria-label="Add New Product" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, maxWidth: "92vw", maxHeight: "90vh", background: "#FFFFFF", zIndex: 850, borderRadius: 24, padding: 28, overflowY: "auto", border: "1px solid #EAE3D9", boxShadow: "0 24px 64px rgba(35,32,29,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#8192D4", letterSpacing: "1px" }}>INVENTORY</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>+ Add New Product</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 34, height: 34, border: "none", cursor: "pointer" }} aria-label="Close add product modal">
                <Icons.Close />
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PRODUCT NAME *</label>
                <input type="text" required placeholder="e.g. Linen Spiral Planner 2027" value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
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
                  <input type="text" placeholder="e.g. Hardcover" value={newProd.subcategory} onChange={(e) => setNewProd({ ...newProd, subcategory: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
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
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>IMAGE URL</label>
                <input type="url" placeholder="https://images.unsplash.com/photo-..." value={newProd.imageUrl} onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
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

              <button type="submit" className="btn" style={{ background: "#8192D4", color: "#FFFFFF", padding: "14px", borderRadius: 12, fontWeight: 700, border: "none", marginTop: 12, cursor: "pointer" }}>
                Add Product to Store Catalog
              </button>
            </form>
          </div>
        </>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <>
          <div onClick={() => setEditingProduct(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 800, backdropFilter: "blur(4px)" }} />
          <div role="dialog" aria-modal="true" aria-label="Edit Product" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, maxWidth: "92vw", maxHeight: "90vh", background: "#FFFFFF", zIndex: 850, borderRadius: 24, padding: 28, overflowY: "auto", border: "1px solid #EAE3D9", boxShadow: "0 24px 64px rgba(35,32,29,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#8192D4", letterSpacing: "1px" }}>EDIT PRODUCT</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>Edit #{editingProduct.id}</h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 34, height: 34, border: "none", cursor: "pointer" }} aria-label="Close edit product modal">
                <Icons.Close />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>IMAGE URL</label>
                <input type="url" placeholder="https://..." value={editForm.imageUrl} onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
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

              <button type="submit" className="btn" style={{ background: "#8192D4", color: "#FFFFFF", padding: "14px", borderRadius: 12, fontWeight: 700, border: "none", marginTop: 12, cursor: "pointer" }}>
                Save Product Changes
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
