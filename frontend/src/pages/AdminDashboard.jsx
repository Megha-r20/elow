import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast, useDocumentTitle } from "../hooks";
import { getApiUrl } from "../api/config";
import { AdminOverview } from "../components/admin/AdminOverview";
import { AdminProducts } from "../components/admin/AdminProducts";
import { AdminOrders } from "../components/admin/AdminOrders";
import { AdminReviews } from "../components/admin/AdminReviews";
import { AdminProductModals } from "../components/admin/AdminProductModals";

export function AdminDashboard() {
    useDocumentTitle("Admin Portal Dashboard");
    const { user, token, isAdmin } = useAuth();
    const { addToast } = useToast();
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

    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewSearch, setReviewSearch] = useState("");
    const [reviewStatusFilter, setReviewStatusFilter] = useState("all");

    const getAuthHeaders = (contentType) => {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        if (contentType) headers["Content-Type"] = contentType;
        return headers;
    };

    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const res = await fetch(getApiUrl("/api/reviews"), {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews || []);
            }
        }
        catch (_err) {
            /* ignore fetch error */
        }
        finally {
            setLoadingReviews(false);
        }
    };

    const handleApproveReview = async (id) => {
        try {
            const res = await fetch(getApiUrl(`/api/reviews/${id}/status`), {
                method: "PATCH",
                headers: getAuthHeaders("application/json"),
                body: JSON.stringify({ status: "approved" }),
            });
            if (res.ok) {
                addToast("✓ Review accepted! It is now live on the customer product page.", "success");
                setReviews(prev => prev.map(r => (r.id === id || r._id === id) ? { ...r, status: "approved" } : r));
            }
            else {
                addToast("Failed to accept review", "error");
            }
        }
        catch (err) {
            addToast("Network error accepting review", "error");
        }
    };

    const handleDeleteReview = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete review "${title}"?`))
            return;
        try {
            const res = await fetch(getApiUrl(`/api/reviews/${id}`), {
                method: "DELETE",
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                addToast("Deleted review successfully");
                setReviews(prev => prev.filter(r => r.id !== id && r._id !== id));
            }
            else {
                addToast("Failed to delete review", "error");
            }
        }
        catch (err) {
            addToast("Network error deleting review", "error");
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchReviews();
    }, [tab]);
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
        stockCount: "10",
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
        stockCount: "10",
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
            stockCount: p.stockCount !== undefined ? String(p.stockCount) : "10",
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
            const parsedStock = editForm.stockCount !== "" && !isNaN(Number(editForm.stockCount)) ? Math.max(0, parseInt(editForm.stockCount, 10)) : 0;
            const res = await fetch(getApiUrl(`/api/admin/products/${editingProduct.id}`), {
                method: "PUT",
                headers: getAuthHeaders("application/json"),
                body: JSON.stringify({
                    name: editForm.name,
                    category: editForm.category,
                    subcategory: editForm.subcategory,
                    price: Number(editForm.price),
                    originalPrice: editForm.originalPrice ? Number(editForm.originalPrice) : undefined,
                    description: editForm.description,
                    images: editForm.imageUrl ? [editForm.imageUrl] : editingProduct.images,
                    inStock: parsedStock > 0 ? editForm.inStock : false,
                    stockCount: parsedStock,
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
            const res = await fetch(getApiUrl("/api/products?limit=all"));
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        }
        catch (_err) {
            /* ignore fetch error */
        }
        finally {
            setLoadingProducts(false);
        }
    };
    // Fetch Orders
    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/orders"), {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        }
        catch (_err) {
            /* ignore fetch error */
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
            const parsedStock = newProd.stockCount !== "" && !isNaN(Number(newProd.stockCount)) ? Math.max(0, parseInt(newProd.stockCount, 10)) : 10;
            const res = await fetch(getApiUrl("/api/admin/products"), {
                method: "POST",
                headers: getAuthHeaders("application/json"),
                body: JSON.stringify({
                    name: newProd.name,
                    category: newProd.category,
                    subcategory: newProd.subcategory,
                    price: Number(newProd.price),
                    originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
                    description: newProd.description,
                    images: newProd.imageUrl ? [newProd.imageUrl] : undefined,
                    inStock: parsedStock > 0 ? newProd.inStock : false,
                    stockCount: parsedStock,
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
                    stockCount: "10",
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
                headers: getAuthHeaders(),
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
                headers: getAuthHeaders("application/json"),
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



    // Delete Single Order
    const handleDeleteSingleOrder = async (orderId) => {
        if (!window.confirm(`Are you sure you want to delete Order #${orderId}?`))
            return;
        try {
            const res = await fetch(getApiUrl(`/api/admin/orders/${orderId}`), {
                method: "DELETE",
                headers: getAuthHeaders(),
            });
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
        return { color: "#8192D4", bg: "rgba(129,146,212,0.15)", border: "rgba(129,146,212,0.3)" };
    };
    return (<div style={{ background: "#FAF7F2", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Banner */}
      <div style={{ background: "#1C1C1A", color: "#FAF7F2", padding: "48px 0 36px", borderBottom: "1px solid #383430", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(129,146,212,0.22)", border: "1px solid rgba(129,146,212,0.4)", color: "#8EBAA3", padding: "5px 14px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, letterSpacing: "1px", marginBottom: 12 }}>
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
            <button onClick={() => { fetchOrders(); fetchProducts(); fetchReviews(); addToast("Refreshed live store data"); }} className="btn" style={{ background: "rgba(255,255,255,0.08)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.15)", padding: "12px 20px", borderRadius: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
              🔄 Refresh Data
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn" style={{ background: "#8192D4", color: "#FFFFFF", padding: "12px 22px", borderRadius: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(129,146,212,0.3)" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 36 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 22, padding: "24px", border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.04)", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "default" }} onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")} onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1.2px", textTransform: "uppercase" }}>TOTAL REVENUE</span>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#EBF3EF", color: "#8192D4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💳</div>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, color: "#23201D", marginTop: 2, letterSpacing: "-0.5px" }}>
              &#8377;{totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p style={{ fontSize: 12.5, color: "#8192D4", marginTop: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ background: "rgba(129,146,212,0.18)", width: 18, height: 18, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span>
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
            <p style={{ fontSize: 12.5, color: "#8192D4", marginTop: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8192D4", display: "inline-block" }}/>
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
              <span style={{ fontSize: 11, fontWeight: 800, color: "#9C968D", letterSpacing: "1.2px", textTransform: "uppercase" }}>CUSTOMER REVIEWS</span>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⭐</div>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, color: "#23201D", marginTop: 2, letterSpacing: "-0.5px" }}>
              {reviews.length} Reviews
            </h3>
            <p style={{ fontSize: 12.5, color: "#D97706", marginTop: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }}/>
              Customer ratings & feedback
            </p>
          </div>
        </div>

        {/* Segmented Pill Tabs Navigation */}
        <div style={{ background: "#EAE3D9", padding: 6, borderRadius: 16, display: "inline-flex", gap: 6, marginBottom: 32, border: "1px solid #DFD7CB" }}>
          {[
            { id: "overview", label: "📊 Store Overview" },
            { id: "products", label: `📦 Products (${products.length})` },
            { id: "orders", label: `🛒 Orders (${orders.length})` },
            { id: "reviews", label: `⭐ Reviews (${reviews.length})` },
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
        {tab === "overview" && (
          <AdminOverview
            orders={orders}
            products={products}
            setTab={setTab}
            getStatusBadgeStyle={getStatusBadgeStyle}
          />
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {tab === "products" && (
          <AdminProducts
            products={products}
            loadingProducts={loadingProducts}
            filteredProducts={filteredProducts}
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            setShowAddModal={setShowAddModal}
            openEditModal={openEditModal}
            handleDeleteProduct={handleDeleteProduct}
          />
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {tab === "orders" && (
          <AdminOrders
            orders={orders}
            loadingOrders={loadingOrders}
            filteredAdminOrders={filteredAdminOrders}
            adminOrderFilter={adminOrderFilter}
            setAdminOrderFilter={setAdminOrderFilter}
            processingCount={processingCount}
            shippedCount={shippedCount}
            deliveredCount={deliveredCount}
            cancelledCount={cancelledCount}
            fetchOrders={fetchOrders}
            addToast={addToast}
            getStatusBadgeStyle={getStatusBadgeStyle}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            handleDeleteSingleOrder={handleDeleteSingleOrder}
          />
        )}

        {/* TAB 4: REVIEWS */}
        {tab === "reviews" && (
          <AdminReviews
            reviews={reviews}
            loadingReviews={loadingReviews}
            reviewSearch={reviewSearch}
            setReviewSearch={setReviewSearch}
            reviewStatusFilter={reviewStatusFilter}
            setReviewStatusFilter={setReviewStatusFilter}
            fetchReviews={fetchReviews}
            handleApproveReview={handleApproveReview}
            handleDeleteReview={handleDeleteReview}
          />
        )}
      </div>

      <AdminProductModals
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newProd={newProd}
        setNewProd={setNewProd}
        handleAddProduct={handleAddProduct}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        editForm={editForm}
        setEditForm={setEditForm}
        handleUpdateProduct={handleUpdateProduct}
      />
    </div>);
}
