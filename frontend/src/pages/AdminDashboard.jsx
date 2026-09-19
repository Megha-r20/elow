import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks";
import { Link, useNavigate } from "react-router";
import { Icons, Divider } from "../components/ui";
import { getApiUrl } from "../api/config";
export function AdminDashboard() {
    const { user, isAdmin } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [tab, setTab] = useState("overview");
    // Products State
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productSearch, setProductSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    // Orders State
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [adminOrderFilter, setAdminOrderFilter] = useState("all");
    // New Product Form Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProd, setNewProd] = useState({
        name: "",
        category: "journals",
        subcategory: "Hardcover",
        price: "",
        originalPrice: "",
        description: "",
        imageUrl: "",
        inStock: true,
        isNew: true,
        isBestseller: false,
    });
    // Edit Product Modal State
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        category: "journals",
        subcategory: "",
        price: "",
        originalPrice: "",
        description: "",
        imageUrl: "",
        inStock: true,
        isNew: false,
        isBestseller: false,
    });
    const openEditModal = (p) => {
        setEditingProduct(p);
        setEditForm({
            name: p.name || "",
            category: p.category || "journals",
            subcategory: p.subcategory || "",
            price: String(p.price || ""),
            originalPrice: p.originalPrice ? String(p.originalPrice) : "",
            description: p.description || "",
            imageUrl: p.images?.[0] || "",
            inStock: p.inStock ?? true,
            isNew: p.isNew ?? false,
            isBestseller: p.isBestseller ?? false,
        });
    };
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (!editingProduct)
            return;
        if (!editForm.name || !editForm.price) {
            addToast("Product name and price are required", "error");
            return;
        }
        try {
            const res = await fetch(getApiUrl(`/api/admin/products/${editingProduct.id}`), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editForm.name,
                    category: editForm.category,
                    subcategory: editForm.subcategory,
                    price: Number(editForm.price),
                    originalPrice: editForm.originalPrice ? Number(editForm.originalPrice) : undefined,
                    description: editForm.description,
                    images: editForm.imageUrl ? [editForm.imageUrl] : editingProduct.images,
                    inStock: editForm.inStock,
                    isNew: editForm.isNew,
                    isBestseller: editForm.isBestseller,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                addToast(`Updated product "${data.product.name}" successfully!`);
                setEditingProduct(null);
                fetchProducts();
            }
            else {
                addToast(data.error || "Failed to update product", "error");
            }
        }
        catch (err) {
            addToast("Network error updating product", "error");
        }
    };
    // Fetch Products
    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await fetch(getApiUrl("/api/products"));
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        }
        catch (err) {
            console.error("Error fetching products:", err);
        }
        finally {
            setLoadingProducts(false);
        }
    };
    // Fetch Orders
    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/orders"));
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        }
        catch (err) {
            console.error("Error fetching orders:", err);
        }
        finally {
            setLoadingOrders(false);
        }
    };
    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, [tab]);
    // Handle Add Product Submit
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProd.name || !newProd.price) {
            addToast("Product name and price are required", "error");
            return;
        }
        try {
            const res = await fetch(getApiUrl("/api/admin/products"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newProd.name,
                    category: newProd.category,
                    subcategory: newProd.subcategory,
                    price: Number(newProd.price),
                    originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
                    description: newProd.description,
                    images: newProd.imageUrl ? [newProd.imageUrl] : undefined,
                    inStock: newProd.inStock,
                    isNew: newProd.isNew,
                    isBestseller: newProd.isBestseller,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                addToast(`Product "${data.product.name}" added successfully!`);
                setShowAddModal(false);
                setNewProd({
                    name: "",
                    category: "journals",
                    subcategory: "Hardcover",
                    price: "",
                    originalPrice: "",
                    description: "",
                    imageUrl: "",
                    inStock: true,
                    isNew: true,
                    isBestseller: false,
                });
                fetchProducts();
            }
            else {
                addToast(data.error || "Failed to add product", "error");
            }
        }
        catch (err) {
            addToast("Network error creating product", "error");
        }
    };
    // Delete Product
    const handleDeleteProduct = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`))
            return;
        try {
            const res = await fetch(getApiUrl(`/api/admin/products/${id}`), {
                method: "DELETE",
            });
            if (res.ok) {
                addToast(`Deleted product "${name}"`);
                setProducts(prev => prev.filter(p => p.id !== id));
            }
            else {
                addToast("Failed to delete product", "error");
            }
        }
        catch (err) {
            addToast("Network error deleting product", "error");
        }
    };
    // Update Order Status
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(getApiUrl(`/api/admin/orders/${orderId}/status`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                addToast(`Order #${orderId} status updated to ${newStatus}`);
                setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
            }
            else {
                addToast("Failed to update order status", "error");
            }
        }
        catch (err) {
            addToast("Error updating order status", "error");
        }
    };

    // Clear All Orders
    const handleClearAllOrders = async () => {
        if (!window.confirm("⚠️ Are you sure you want to clear ALL store orders from MongoDB Atlas? This action cannot be undone."))
            return;
        try {
            const res = await fetch(getApiUrl("/api/admin/orders"), { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                addToast("All store orders cleared successfully!", "info");
                setOrders([]);
            }
            else {
                addToast(data.error || "Failed to clear orders", "error");
            }
        }
        catch (err) {
            addToast("Network error clearing orders", "error");
        }
    };

    // Delete Single Order
    const handleDeleteSingleOrder = async (orderId) => {
        if (!window.confirm(`Are you sure you want to delete Order #${orderId}?`))
            return;
        try {
            const res = await fetch(getApiUrl(`/api/admin/orders/${orderId}`), { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                addToast(`Order #${orderId} deleted successfully`);
                setOrders(prev => prev.filter(o => o.id !== orderId));
            }
            else {
                addToast(data.error || "Failed to delete order", "error");
            }
        }
        catch (err) {
            addToast("Network error deleting order", "error");
        }
    };
    if (!isAdmin) {
        return (<div style={{ background: "#FAF7F2", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#FFFFFF", padding: "40px 32px", borderRadius: 24, border: "1px solid #EAE3D9", textAlign: "center", maxWidth: 440, boxShadow: "0 12px 32px rgba(35,32,29,0.08)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#23201D" }}>Admin Access Required</h2>
          <p style={{ fontSize: 13.5, color: "#6E6A63", marginTop: 8, lineHeight: 1.6 }}>
            You need to be logged in with an Admin account to access the Elow Admin Portal.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Link to="/" className="btn btn-outline btn-md btn-full">
              Back to Home
            </Link>
          </div>
        </div>
      </div>);
    }
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrdersCount = orders.length;
    const inStockCount = products.filter(p => p.inStock).length;

    // Filtered Admin Orders by Status
    const processingCount = orders.filter(o => (o.status || "Processing").toLowerCase() === "processing" || (o.status || "").toLowerCase() === "order placed").length;
    const shippedCount = orders.filter(o => (o.status || "").toLowerCase() === "shipped").length;
    const deliveredCount = orders.filter(o => (o.status || "").toLowerCase() === "delivered").length;
    const cancelledCount = orders.filter(o => (o.status || "").toLowerCase() === "cancelled").length;

    const filteredAdminOrders = orders.filter(o => {
        const s = (o.status || "Processing").toLowerCase();
        if (adminOrderFilter === "processing") return s === "processing" || s === "order placed";
        if (adminOrderFilter === "shipped") return s === "shipped";
        if (adminOrderFilter === "delivered") return s === "delivered";
        if (adminOrderFilter === "cancelled") return s === "cancelled";
        return true;
    });

    // Filtered Products for Tab 2
    const filteredProducts = products.filter(p => {
        const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
        const matchesSearch = !productSearch.trim() || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.subcategory.toLowerCase().includes(productSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    const getStatusBadgeStyle = (status) => {
        const s = status.toLowerCase();
        if (s === "cancelled")
            return { color: "#DC2626", bg: "rgba(220,38,38,0.12)", border: "rgba(220,38,38,0.3)" };
        if (s === "delivered")
            return { color: "#16A34A", bg: "rgba(22,163,74,0.12)", border: "rgba(22,163,74,0.3)" };
        if (s === "shipped")
            return { color: "#2563EB", bg: "rgba(37,99,235,0.12)", border: "rgba(37,99,235,0.3)" };
        return { color: "#5E8C77", bg: "rgba(94,140,119,0.15)", border: "rgba(94,140,119,0.3)" };
    };
    return (<div style={{ background: "#FAF7F2", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Banner */}
      <div style={{ background: "#1C1C1A", color: "#FAF7F2", padding: "48px 0 36px", borderBottom: "1px solid #383430", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(94,140,119,0.22)", border: "1px solid rgba(94,140,119,0.4)", color: "#8EBAA3", padding: "5px 14px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, letterSpacing: "1px", marginBottom: 12 }}>
              ⚡ ELOW ADMIN CONTROL CENTER
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
              Welcome back, {user?.name || "Admin"}
            </h1>
            <p style={{ fontSize: 14, color: "#9C968D", marginTop: 6, fontWeight: 400 }}>
              Live store controls, real-time customer orders, and catalog management.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => { fetchOrders(); fetchProducts(); addToast("Refreshed live store data"); }} className="btn" style={{ background: "rgba(255,255,255,0.08)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.15)", padding: "12px 20px", borderRadius: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
              🔄 Refresh Data
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn" style={{ background: "#5E8C77", color: "#FFFFFF", padding: "12px 22px", borderRadius: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(94,140,119,0.3)" }}>
              + Add New Product
            </button>
            <Link to="/shop" className="btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#FFFFFF", padding: "12px 20px", borderRadius: 12, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              View Shop ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 32 }}>
        {/* Metric Cards Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 36 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 22, padding: "24px", border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.04)", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "default" }} onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")} onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1.2px", textTransform: "uppercase" }}>TOTAL REVENUE</span>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#EBF3EF", color: "#5E8C77", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💳</div>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, color: "#23201D", marginTop: 2, letterSpacing: "-0.5px" }}>
              &#8377;{totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p style={{ fontSize: 12.5, color: "#5E8C77", marginTop: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ background: "rgba(94,140,119,0.18)", width: 18, height: 18, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span>
              From {totalOrdersCount} store orders
            </p>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 22, padding: "24px", border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.04)", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "default" }} onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")} onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1.2px", textTransform: "uppercase" }}>TOTAL ORDERS</span>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#FAF0E6", color: "#D97762", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, color: "#23201D", marginTop: 2, letterSpacing: "-0.5px" }}>
              {totalOrdersCount} Orders
            </h3>
            <p style={{ fontSize: 12.5, color: "#5E8C77", marginTop: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5E8C77", display: "inline-block" }}/>
              Live customer tracking
            </p>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 22, padding: "24px", border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.04)", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "default" }} onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")} onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1.2px", textTransform: "uppercase" }}>TOTAL PRODUCTS</span>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#F3EFF7", color: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛒</div>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, color: "#23201D", marginTop: 2, letterSpacing: "-0.5px" }}>
              {products.length} Items
            </h3>
            <p style={{ fontSize: 12.5, color: "#6E6A63", marginTop: 8, fontWeight: 600 }}>
              {inStockCount} available in stock
            </p>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 22, padding: "24px", border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.04)", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "default" }} onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")} onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1.2px", textTransform: "uppercase" }}>REGISTERED USERS</span>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#EBF1F7", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👥</div>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, color: "#23201D", marginTop: 2, letterSpacing: "-0.5px" }}>
              2 Accounts
            </h3>
            <p style={{ fontSize: 12.5, color: "#9C968D", marginTop: 8, fontWeight: 600 }}>
              Admin & Customer roles
            </p>
          </div>
        </div>

        {/* Segmented Pill Tabs Navigation */}
        <div style={{ background: "#EAE3D9", padding: 6, borderRadius: 16, display: "inline-flex", gap: 6, marginBottom: 32, border: "1px solid #DFD7CB" }}>
          {[
            { id: "overview", label: "📊 Store Overview" },
            { id: "products", label: `📦 Products (${products.length})` },
            { id: "orders", label: `🛒 Orders (${orders.length})` },
        ].map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "11px 24px",
                fontSize: 13.5,
                fontWeight: 700,
                borderRadius: 12,
                border: "none",
                background: tab === t.id ? "#FFFFFF" : "transparent",
                color: tab === t.id ? "#23201D" : "#6E6A63",
                boxShadow: tab === t.id ? "0 4px 14px rgba(35,32,29,0.10)" : "none",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              {t.label}
            </button>))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === "overview" && (<div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 24, border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: "#23201D" }}>Recent Customer Orders</h3>
                  <p style={{ fontSize: 12.5, color: "#9C968D", marginTop: 2 }}>Live activity across customer checkout sessions</p>
                </div>
                <button onClick={() => setTab("orders")} style={{ fontSize: 12.5, fontWeight: 700, color: "#5E8C77", background: "none", border: "none", cursor: "pointer" }}>
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (<div style={{ padding: "40px 0", textAlign: "center", color: "#9C968D" }}>
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>🛒</div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#23201D" }}>No customer orders placed yet</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Place an order via Checkout to test real-time order tracking.</p>
                </div>) : (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {orders.map(o => {
                    const bStyle = getStatusBadgeStyle(o.status || "Processing");
                    return (<div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#FAF7F2", borderRadius: 16, border: "1px solid #EAE3D9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#23201D", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 }}>
                            {o.deliveryAddress?.firstName ? o.deliveryAddress.firstName.charAt(0).toUpperCase() : "C"}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, color: "#23201D", fontFamily: "monospace" }}>#{o.id}</p>
                              <span style={{ fontSize: 10.5, fontWeight: 800, color: bStyle.color, background: bStyle.bg, border: `1px solid ${bStyle.border}`, padding: "2px 8px", borderRadius: 999 }}>
                                ● {o.status || "Processing"}
                              </span>
                            </div>
                            <p style={{ fontSize: 12, color: "#6E6A63", marginTop: 3 }}>
                              {o.deliveryAddress?.firstName} {o.deliveryAddress?.lastName} ({o.deliveryAddress?.email}) · {o.items?.length || 0} item(s)
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 16, fontWeight: 800, color: "#23201D" }}>&#8377;{o.total?.toLocaleString("en-IN")}</p>
                          <p style={{ fontSize: 11.5, color: "#9C968D", marginTop: 2 }}>{o.date || "Today"}</p>
                        </div>
                      </div>);
                })}
                </div>)}
            </div>

            <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 24, border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: "#23201D", marginBottom: 20 }}>Category Breakdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["journals", "planners", "pens", "workspace", "accessories"].map(cat => {
                const count = products.filter(p => p.category === cat).length;
                const pct = Math.round((count / (products.length || 1)) * 100);
                return (<div key={cat} style={{ background: "#FAF7F2", padding: "12px 16px", borderRadius: 14, border: "1px solid #EAE3D9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ textTransform: "capitalize", fontSize: 13.5, fontWeight: 700, color: "#23201D" }}>{cat}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#5E8C77" }}>{count} items ({pct}%)</span>
                      </div>
                      <div style={{ height: 6, background: "#EAE3D9", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#5E8C77", borderRadius: 999 }}/>
                      </div>
                    </div>);
            })}
              </div>
            </div>
          </div>)}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {tab === "products" && (<div style={{ background: "#FFFFFF", padding: 28, borderRadius: 24, border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>Product Catalog Management</h3>
                <p style={{ fontSize: 13, color: "#9C968D", marginTop: 2 }}>Manage inventory, add custom products, or delete items from the live store.</p>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input type="text" placeholder="Search products…" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="field field-sm" style={{ minWidth: 200 }}/>

                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="field field-sm">
                  <option value="all">All Categories</option>
                  <option value="journals">Journals</option>
                  <option value="planners">Planners</option>
                  <option value="pens">Pens</option>
                  <option value="workspace">Workspace</option>
                  <option value="accessories">Accessories</option>
                </select>

                <button onClick={() => setShowAddModal(true)} className="btn" style={{ background: "#5E8C77", color: "#FFFFFF", padding: "10px 20px", borderRadius: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>
                  + Add Product
                </button>
              </div>
            </div>

            {loadingProducts ? (<div style={{ padding: 40, textAlign: "center", color: "#9C968D" }}>Loading product inventory...</div>) : (<div style={{ overflowX: "auto" }}>
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
                    {filteredProducts.map(p => (<tr key={p.id} style={{ borderBottom: "1px solid #F4EFE6", fontSize: 13.5 }}>
                        <td style={{ padding: "14px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <img src={p.images?.[0]} alt={p.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", border: "1px solid #EAE3D9" }}/>
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
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: p.inStock ? "#5E8C77" : "#DC2626", background: p.inStock ? "rgba(94,140,119,0.15)" : "rgba(220,38,38,0.15)", padding: "4px 10px", borderRadius: 999 }}>
                            {p.inStock ? "In Stock" : "Out of Stock"}
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
                            <button onClick={() => openEditModal(p)} style={{ background: "#FAF7F2", color: "#5E8C77", border: "1px solid #5E8C77", padding: "7px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#5E8C77"; e.currentTarget.style.color = "#FFFFFF"; }} onMouseLeave={e => { e.currentTarget.style.background = "#FAF7F2"; e.currentTarget.style.color = "#5E8C77"; }}>
                              ✏️ Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id, p.name)} style={{ background: "#FDF2F2", color: "#DC2626", border: "1px solid #F8B4B4", padding: "7px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>)}
          </div>)}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {tab === "orders" && (<div style={{ background: "#FFFFFF", padding: 28, borderRadius: 24, border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>Customer Orders Fulfillment</h3>
                <p style={{ fontSize: 13, color: "#9C968D", marginTop: 2 }}>Track orders, update fulfillment status in real-time, and inspect customer addresses.</p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { fetchOrders(); addToast("Refreshed orders list"); }} className="btn" style={{ background: "#FAF7F2", border: "1px solid #EAE3D9", color: "#23201D", padding: "8px 16px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
                  🔄 Refresh Orders
                </button>
                {orders.length > 0 && (
                  <button onClick={handleClearAllOrders} className="btn" style={{ background: "#FDF2F2", border: "1px solid #F8B4B4", color: "#DC2626", padding: "8px 16px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
                    🗑️ Clear All Orders
                  </button>
                )}
              </div>
            </div>

            {/* Order Status Category Filter Bars */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              {[
                { id: "all", label: `All Orders (${orders.length})` },
                { id: "processing", label: `Processing 🟡 (${processingCount})` },
                { id: "shipped", label: `Shipped 🔵 (${shippedCount})` },
                { id: "delivered", label: `Delivered 🟢 (${deliveredCount})` },
                { id: "cancelled", label: `Cancelled 🔴 (${cancelledCount})` },
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setAdminOrderFilter(st.id)}
                  style={{
                    background: adminOrderFilter === st.id ? "#23201D" : "#FAF7F2",
                    color: adminOrderFilter === st.id ? "#FAF7F2" : "#6E6A63",
                    border: `1.5px solid ${adminOrderFilter === st.id ? "#23201D" : "#EAE3D9"}`,
                    borderRadius: 999,
                    padding: "8px 18px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s ease",
                    boxShadow: adminOrderFilter === st.id ? "0 4px 12px rgba(35,32,29,0.12)" : "none",
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {loadingOrders ? (<div style={{ padding: 40, textAlign: "center", color: "#9C968D" }}>Loading live orders...</div>) : filteredAdminOrders.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", background: "#FAF7F2", borderRadius: 20, border: "1px dashed #EAE3D9" }}>
                <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📦</div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: "#23201D" }}>No {adminOrderFilter !== "all" ? adminOrderFilter : ""} orders found</h4>
                <p style={{ fontSize: 13, color: "#9C968D", marginTop: 4 }}>There are currently no orders in this status category.</p>
              </div>
            ) : (<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {filteredAdminOrders.map(o => {
                    const bStyle = getStatusBadgeStyle(o.status || "Processing");
                    return (<div key={o.id} style={{ border: "1px solid #EAE3D9", borderRadius: 20, padding: 24, background: "#FAF7F2" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#5E8C77", letterSpacing: "1px" }}>ORDER ID</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: bStyle.color, background: bStyle.bg, border: `1px solid ${bStyle.border}`, padding: "2px 10px", borderRadius: 999 }}>
                              ● {o.status || "Processing"}
                            </span>
                          </div>
                          <h4 style={{ fontSize: 18, fontWeight: 800, color: "#23201D", fontFamily: "monospace", marginTop: 4 }}>#{o.id}</h4>
                          <p style={{ fontSize: 12, color: "#9C968D", marginTop: 2 }}>Placed on {o.date || "Today"}</p>
                        </div>

                        {/* Status Change Dropdown & Delete Order Action */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFFFFF", padding: "8px 14px", borderRadius: 12, border: "1px solid #EAE3D9" }}>
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#23201D" }}>Update Status:</span>
                            <select value={o.status || "Processing"} onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)} style={{
                              padding: "6px 14px",
                              borderRadius: 8,
                              border: `1.5px solid ${bStyle.color}`,
                              background: bStyle.bg,
                              fontSize: 13,
                              fontWeight: 800,
                              color: bStyle.color,
                              cursor: "pointer",
                              outline: "none",
                          }}>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                          <button
                            onClick={() => handleDeleteSingleOrder(o.id)}
                            title="Delete Order"
                            style={{
                              background: "#FDF2F2",
                              color: "#DC2626",
                              border: "1px solid #F8B4B4",
                              padding: "8px 14px",
                              borderRadius: 12,
                              fontSize: 12.5,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      <Divider margin={14}/>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1px", marginBottom: 6 }}>DELIVERY ADDRESS</p>
                          <p style={{ fontSize: 13, color: "#23201D", lineHeight: 1.6 }}>
                            <strong>{o.deliveryAddress?.firstName} {o.deliveryAddress?.lastName}</strong><br />
                            {o.deliveryAddress?.email}<br />
                            {o.deliveryAddress?.address}, {o.deliveryAddress?.city}<br />
                            Phone: {o.deliveryAddress?.phone || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1px", marginBottom: 6 }}>ORDER SUMMARY</p>
                          <p style={{ fontSize: 13, color: "#23201D", lineHeight: 1.6 }}>
                            Payment Method: <span style={{ fontWeight: 800, textTransform: "uppercase" }}>{o.payMethod}</span><br />
                            Total Amount: <strong style={{ fontSize: 16, color: "#5E8C77" }}>&#8377;{o.total?.toLocaleString("en-IN")}</strong>
                          </p>
                        </div>
                      </div>

                      {o.items && o.items.length > 0 && (<div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px dashed #EAE3D9" }}>
                          <p style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1px", marginBottom: 10 }}>ORDERED ITEMS ({o.items.length})</p>
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {o.items.map((item, idx) => (<div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFFFFF", padding: "6px 12px", borderRadius: 12, border: "1px solid #EAE3D9", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
                                {item.product?.images?.[0] && (<img src={item.product.images[0]} alt={item.product.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", border: "1px solid #EAE3D9" }}/>)}
                                <div>
                                  <p style={{ fontSize: 12.5, fontWeight: 700, color: "#23201D" }}>{item.product?.name || "Product"}</p>
                                  <p style={{ fontSize: 11, color: "#9C968D" }}>&#8377;{item.product?.price || 0}</p>
                                </div>
                                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#5E8C77", background: "rgba(94,140,119,0.12)", padding: "2px 8px", borderRadius: 6, marginLeft: 4 }}>
                                  x{item.qty || 1}
                                </span>
                              </div>))}
                          </div>
                        </div>)}
                    </div>);
                })}
              </div>)}
          </div>)}
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (<>
          <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 800, backdropFilter: "blur(4px)" }}/>
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, maxWidth: "92vw", maxHeight: "90vh", background: "#FFFFFF", zIndex: 850, borderRadius: 24, padding: 28, overflowY: "auto", border: "1px solid #EAE3D9", boxShadow: "0 24px 64px rgba(35,32,29,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#5E8C77", letterSpacing: "1px" }}>INVENTORY</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>+ Add New Product</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 34, height: 34, border: "none", cursor: "pointer" }}>
                <Icons.Close />
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PRODUCT NAME *</label>
                <input type="text" required placeholder="e.g. Linen Spiral Planner 2027" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>CATEGORY</label>
                  <select value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}>
                    <option value="journals">Journals</option>
                    <option value="planners">Planners</option>
                    <option value="pens">Pens & Ink</option>
                    <option value="washi">Washi Tape</option>
                    <option value="stickers">Stickers</option>
                    <option value="workspace">Workspace</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>SUBCATEGORY</label>
                  <input type="text" placeholder="e.g. Hardcover" value={newProd.subcategory} onChange={e => setNewProd({ ...newProd, subcategory: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PRICE (&#8377;) *</label>
                  <input type="number" required placeholder="1299" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>ORIGINAL PRICE (&#8377;)</label>
                  <input type="number" placeholder="1599" value={newProd.originalPrice} onChange={e => setNewProd({ ...newProd, originalPrice: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>IMAGE URL</label>
                <input type="url" placeholder="https://images.unsplash.com/photo-..." value={newProd.imageUrl} onChange={e => setNewProd({ ...newProd, imageUrl: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>DESCRIPTION</label>
                <textarea rows={3} placeholder="Write a short description..." value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
              </div>

              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={newProd.inStock} onChange={e => setNewProd({ ...newProd, inStock: e.target.checked })}/>
                  In Stock
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={newProd.isNew} onChange={e => setNewProd({ ...newProd, isNew: e.target.checked })}/>
                  New Arrival
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={newProd.isBestseller} onChange={e => setNewProd({ ...newProd, isBestseller: e.target.checked })}/>
                  Bestseller
                </label>
              </div>

              <button type="submit" className="btn" style={{ background: "#5E8C77", color: "#FFFFFF", padding: "14px", borderRadius: 12, fontWeight: 700, border: "none", marginTop: 12, cursor: "pointer" }}>
                Add Product to Store Catalog
              </button>
            </form>
          </div>
        </>)}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (<>
          <div onClick={() => setEditingProduct(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 800, backdropFilter: "blur(4px)" }}/>
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, maxWidth: "92vw", maxHeight: "90vh", background: "#FFFFFF", zIndex: 850, borderRadius: 24, padding: 28, overflowY: "auto", border: "1px solid #EAE3D9", boxShadow: "0 24px 64px rgba(35,32,29,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#5E8C77", letterSpacing: "1px" }}>EDIT PRODUCT</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>Edit #{editingProduct.id}</h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 34, height: 34, border: "none", cursor: "pointer" }}>
                <Icons.Close />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PRODUCT NAME *</label>
                <input type="text" required placeholder="Product name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>CATEGORY</label>
                  <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}>
                    <option value="journals">Journals</option>
                    <option value="planners">Planners</option>
                    <option value="pens">Pens & Ink</option>
                    <option value="washi">Washi Tape</option>
                    <option value="stickers">Stickers</option>
                    <option value="workspace">Workspace</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>SUBCATEGORY</label>
                  <input type="text" placeholder="Subcategory" value={editForm.subcategory} onChange={e => setEditForm({ ...editForm, subcategory: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PRICE (&#8377;) *</label>
                  <input type="number" required placeholder="Price" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>ORIGINAL PRICE (&#8377;)</label>
                  <input type="number" placeholder="Original price" value={editForm.originalPrice} onChange={e => setEditForm({ ...editForm, originalPrice: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>IMAGE URL</label>
                <input type="url" placeholder="https://..." value={editForm.imageUrl} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>DESCRIPTION</label>
                <textarea rows={3} placeholder="Description..." value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}/>
              </div>

              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={editForm.inStock} onChange={e => setEditForm({ ...editForm, inStock: e.target.checked })}/>
                  In Stock
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={editForm.isNew} onChange={e => setEditForm({ ...editForm, isNew: e.target.checked })}/>
                  New Arrival
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={editForm.isBestseller} onChange={e => setEditForm({ ...editForm, isBestseller: e.target.checked })}/>
                  Bestseller
                </label>
              </div>

              <button type="submit" className="btn" style={{ background: "#5E8C77", color: "#FFFFFF", padding: "14px", borderRadius: 12, fontWeight: 700, border: "none", marginTop: 12, cursor: "pointer" }}>
                Save Product Changes
              </button>
            </form>
          </div>
        </>)}
    </div>);
}
