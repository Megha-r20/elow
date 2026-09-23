export function AdminProducts({
  products: _products = [],
  loadingProducts = false,
  filteredProducts = [],
  productSearch = "",
  setProductSearch,
  categoryFilter = "all",
  setCategoryFilter,
  setShowAddModal,
  openEditModal,
  handleDeleteProduct,
}) {
  return (
    <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 24, border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>Product Catalog Management</h3>
          <p style={{ fontSize: 13, color: "#9C968D", marginTop: 2 }}>Manage inventory, add custom products, or delete items from the live store.</p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input type="text" placeholder="Search products…" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="field field-sm" style={{ minWidth: 200 }} />

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="field field-sm">
            <option value="all">All Categories</option>
            <option value="journals">Journals</option>
            <option value="pens">Pens & Ink</option>
            <option value="washi">Washi Tape</option>
            <option value="stickers">Stickers</option>
            <option value="planners">Planners</option>
            <option value="desk">Workspace & Desk</option>
            <option value="gifting">Accessories</option>
          </select>

          <button onClick={() => setShowAddModal(true)} className="btn" style={{ background: "#AB88CD", color: "#FFFFFF", padding: "10px 20px", borderRadius: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>
            + Add Product
          </button>
        </div>
      </div>

      {loadingProducts ? (
        <div style={{ padding: 40, textAlign: "center", color: "#9C968D" }}>Loading product inventory...</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #EAE3D9", fontSize: 11.5, fontWeight: 800, color: "#9C968D", letterSpacing: "1px" }}>
                <th style={{ padding: "14px 12px" }}>PRODUCT DETAILS</th>
                <th style={{ padding: "14px 12px" }}>CATEGORY</th>
                <th style={{ padding: "14px 12px" }}>PRICE</th>
                <th style={{ padding: "14px 12px" }}>STOCK</th>
                <th style={{ padding: "14px 12px" }}>BADGES</th>
                <th style={{ padding: "14px 12px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #F4EFE6", fontSize: 13.5 }}>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <img src={p.images?.[0]} alt={p.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", border: "1px solid #EAE3D9" }} />
                      <div>
                        <p style={{ fontWeight: 700, color: "#23201D" }}>{p.name}</p>
                        <p style={{ fontSize: 11.5, color: "#9C968D", fontFamily: "monospace" }}>ID: {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 12px", textTransform: "capitalize", fontWeight: 600, color: "#6E6A63" }}>
                    <span style={{ background: "#FAF7F2", border: "1px solid #EAE3D9", padding: "4px 10px", borderRadius: 8, fontSize: 12 }}>
                      {p.category} / {p.subcategory}
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: 800, color: "#23201D" }}>
                    &#8377;{p.price}
                    {p.originalPrice && <span style={{ fontSize: 11.5, color: "#9C968D", textDecoration: "line-through", marginLeft: 6 }}>&#8377;{p.originalPrice}</span>}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: p.inStock ? "#AB88CD" : "#DC2626", background: p.inStock ? "rgba(171, 136, 205,0.15)" : "rgba(220,38,38,0.15)", padding: "4px 10px", borderRadius: 999 }}>
                      {p.inStock ? `In Stock (${p.stockCount ?? 0})` : `Out of Stock (${p.stockCount ?? 0})`}
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.isNew && <span style={{ fontSize: 10, fontWeight: 800, background: "#23201D", color: "#FFFFFF", padding: "3px 8px", borderRadius: 6 }}>NEW</span>}
                      {p.isBestseller && <span style={{ fontSize: 10, fontWeight: 800, background: "#D97706", color: "#FFFFFF", padding: "3px 8px", borderRadius: 6 }}>BESTSELLER</span>}
                    </div>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button onClick={() => openEditModal(p)} style={{ background: "#FAF7F2", color: "#AB88CD", border: "1px solid #AB88CD", padding: "7px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#AB88CD"; e.currentTarget.style.color = "#FFFFFF"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#FAF7F2"; e.currentTarget.style.color = "#AB88CD"; }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id, p.name)} style={{ background: "#FDF2F2", color: "#DC2626", border: "1px solid #F8B4B4", padding: "7px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                        Delete
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
  );
}
