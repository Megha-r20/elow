import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks";
import { Link, useNavigate } from "react-router";
import { Icons, SectionHead, Divider } from "../components/ui";

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
};

type AdminOrder = {
  id: string;
  items: Array<{ product: any; qty: number }>;
  deliveryAddress: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  payMethod: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  date: string;
};

export function AdminDashboard() {
  const { user, isAdmin, token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");

  // Products State
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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

  // Fetch Products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Handle Add Product Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) {
      addToast("Product name and price are required", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/products", {
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
      } else {
        addToast(data.error || "Failed to add product", "error");
      }
    } catch (err) {
      addToast("Network error creating product", "error");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        addToast(`Deleted product "${name}"`);
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        addToast("Failed to delete product", "error");
      }
    } catch (err) {
      addToast("Network error deleting product", "error");
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        addToast(`Order ${orderId} status updated to ${newStatus}`);
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        addToast("Failed to update order status", "error");
      }
    } catch (err) {
      addToast("Error updating order status", "error");
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ background: "#FAF7F2", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
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
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const inStockCount = products.filter(p => p.inStock).length;

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Banner */}
      <div style={{ background: "#23201D", color: "#FAF7F2", padding: "40px 0 32px", borderBottom: "1px solid #383430" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(94,140,119,0.25)", color: "#8EBAA3", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
              ⚡ ADMIN MANAGEMENT PORTAL
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
              Welcome, {user?.name || "Admin"}
            </h1>
            <p style={{ fontSize: 14, color: "#9C968D", marginTop: 4 }}>
              Manage products, inspect placed store orders, and control inventory.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn"
              style={{ background: "#5E8C77", color: "#FFFFFF", padding: "12px 20px", borderRadius: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer" }}
            >
              + Add New Product
            </button>
            <Link to="/shop" className="btn" style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF", padding: "12px 20px", borderRadius: 12, fontWeight: 600, textDecoration: "none" }}>
              View Store Front ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 32 }}>
        {/* Metric Cards Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "20px 24px", border: "1px solid #EAE3D9", boxShadow: "0 4px 16px rgba(35,32,29,0.04)" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#9C968D", letterSpacing: "1px" }}>TOTAL REVENUE</span>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: "#23201D", marginTop: 6 }}>
              &#8377;{totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p style={{ fontSize: 12, color: "#5E8C77", marginTop: 4, fontWeight: 600 }}>From {totalOrdersCount} store orders</p>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "20px 24px", border: "1px solid #EAE3D9", boxShadow: "0 4px 16px rgba(35,32,29,0.04)" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#9C968D", letterSpacing: "1px" }}>TOTAL ORDERS</span>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: "#23201D", marginTop: 6 }}>
              {totalOrdersCount} Orders
            </h3>
            <p style={{ fontSize: 12, color: "#5E8C77", marginTop: 4, fontWeight: 600 }}>Active state tracking</p>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "20px 24px", border: "1px solid #EAE3D9", boxShadow: "0 4px 16px rgba(35,32,29,0.04)" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#9C968D", letterSpacing: "1px" }}>TOTAL PRODUCTS</span>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: "#23201D", marginTop: 6 }}>
              {products.length} Items
            </h3>
            <p style={{ fontSize: 12, color: "#6E6A63", marginTop: 4, fontWeight: 600 }}>{inStockCount} in stock</p>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "20px 24px", border: "1px solid #EAE3D9", boxShadow: "0 4px 16px rgba(35,32,29,0.04)" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#9C968D", letterSpacing: "1px" }}>REGISTERED USERS</span>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: "#23201D", marginTop: 6 }}>
              2 Demo Accounts
            </h3>
            <p style={{ fontSize: 12, color: "#9C968D", marginTop: 4, fontWeight: 600 }}>Admin & Customer roles</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 12, borderBottom: "2px solid #EAE3D9", marginBottom: 28 }}>
          {[
            { id: "overview", label: "📊 Store Overview" },
            { id: "products", label: `📦 Products (${products.length})` },
            { id: "orders", label: `🛒 Orders (${orders.length})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                color: tab === t.id ? "#5E8C77" : "#9C968D",
                borderBottom: `3px solid ${tab === t.id ? "#5E8C77" : "transparent"}`,
                marginBottom: -2,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 20, border: "1px solid #EAE3D9" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#23201D", marginBottom: 16 }}>Recent Store Orders</h3>
              {orders.length === 0 ? (
                <div style={{ padding: "30px 0", textAlign: "center", color: "#9C968D" }}>
                  <p style={{ fontSize: 14 }}>No customer orders received yet.</p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>Place an order via Checkout to test real-time order tracking.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#FAF7F2", borderRadius: 12, border: "1px solid #EAE3D9" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#23201D" }}>Order #{o.id}</p>
                        <p style={{ fontSize: 12, color: "#9C968D" }}>{o.deliveryAddress?.email} · {o.items?.length || 0} items</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#23201D" }}>&#8377;{o.total?.toLocaleString("en-IN")}</p>
                        <span style={{ fontSize: 11, fontWeight: 700, color: o.status === "Delivered" ? "#5E8C77" : "#D97706", background: o.status === "Delivered" ? "rgba(94,140,119,0.15)" : "rgba(217,119,6,0.15)", padding: "2px 8px", borderRadius: 999 }}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 20, border: "1px solid #EAE3D9" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#23201D", marginBottom: 16 }}>Product Categories</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["journals", "planners", "pens", "workspace", "accessories"].map(cat => {
                  const count = products.filter(p => p.category === cat).length;
                  return (
                    <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#FAF7F2", borderRadius: 10 }}>
                      <span style={{ textTransform: "capitalize", fontSize: 13, fontWeight: 600, color: "#23201D" }}>{cat}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#5E8C77" }}>{count} items</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {tab === "products" && (
          <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 20, border: "1px solid #EAE3D9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#23201D" }}>Product Catalog Management</h3>
                <p style={{ fontSize: 12.5, color: "#9C968D" }}>Add new items or remove obsolete products from inventory.</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn"
                style={{ background: "#5E8C77", color: "#FFFFFF", padding: "10px 18px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                + Add Product
              </button>
            </div>

            {loadingProducts ? (
              <div style={{ padding: 40, textAlign: "center", color: "#9C968D" }}>Loading product inventory...</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #EAE3D9", fontSize: 12, fontWeight: 700, color: "#9C968D", letterSpacing: "0.5px" }}>
                      <th style={{ padding: "12px 8px" }}>PRODUCT</th>
                      <th style={{ padding: "12px 8px" }}>CATEGORY</th>
                      <th style={{ padding: "12px 8px" }}>PRICE</th>
                      <th style={{ padding: "12px 8px" }}>STOCK</th>
                      <th style={{ padding: "12px 8px" }}>FLAGS</th>
                      <th style={{ padding: "12px 8px", textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #F4EFE6", fontSize: 13 }}>
                        <td style={{ padding: "12px 8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <img src={p.images?.[0]} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                            <div>
                              <p style={{ fontWeight: 700, color: "#23201D" }}>{p.name}</p>
                              <p style={{ fontSize: 11, color: "#9C968D" }}>ID: {p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 8px", textTransform: "capitalize", fontWeight: 600, color: "#6E6A63" }}>
                          {p.category} / {p.subcategory}
                        </td>
                        <td style={{ padding: "12px 8px", fontWeight: 700, color: "#23201D" }}>
                          &#8377;{p.price}
                          {p.originalPrice && <span style={{ fontSize: 11, color: "#9C968D", textDecoration: "line-through", marginLeft: 6 }}>&#8377;{p.originalPrice}</span>}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: p.inStock ? "#5E8C77" : "#DC2626", background: p.inStock ? "rgba(94,140,119,0.15)" : "rgba(220,38,38,0.15)", padding: "3px 8px", borderRadius: 999 }}>
                            {p.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {p.isNew && <span style={{ fontSize: 10, fontWeight: 700, background: "#23201D", color: "#FFFFFF", padding: "2px 6px", borderRadius: 4 }}>NEW</span>}
                            {p.isBestseller && <span style={{ fontSize: 10, fontWeight: 700, background: "#D97706", color: "#FFFFFF", padding: "2px 6px", borderRadius: 4 }}>BESTSELLER</span>}
                          </div>
                        </td>
                        <td style={{ padding: "12px 8px", textAlign: "right" }}>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            style={{ background: "#FDF2F2", color: "#DC2626", border: "1px solid #F8B4B4", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {tab === "orders" && (
          <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 20, border: "1px solid #EAE3D9" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#23201D", marginBottom: 6 }}>Customer Orders Management</h3>
            <p style={{ fontSize: 12.5, color: "#9C968D", marginBottom: 20 }}>Track order fulfillment, update delivery status, and review payment methods.</p>

            {loadingOrders ? (
              <div style={{ padding: 40, textAlign: "center", color: "#9C968D" }}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#9C968D" }}>No orders found in memory store.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {orders.map(o => (
                  <div key={o.id} style={{ border: "1px solid #EAE3D9", borderRadius: 16, padding: 20, background: "#FAF7F2" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#5E8C77", letterSpacing: "1px" }}>ORDER ID</span>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#23201D", fontFamily: "monospace" }}>{o.id}</h4>
                        <p style={{ fontSize: 12, color: "#9C968D", marginTop: 2 }}>Placed on {o.date || "Today"}</p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#23201D" }}>Status:</span>
                        <select
                          value={o.status || "Processing"}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "1px solid #5E8C77",
                            background: "#FFFFFF",
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: "#23201D",
                            cursor: "pointer",
                          }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <Divider margin={12} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#9C968D", marginBottom: 4 }}>DELIVERY ADDRESS</p>
                        <p style={{ fontSize: 12.5, color: "#23201D", lineHeight: 1.5 }}>
                          <strong>{o.deliveryAddress?.firstName} {o.deliveryAddress?.lastName}</strong><br />
                          {o.deliveryAddress?.email}<br />
                          {o.deliveryAddress?.address}, {o.deliveryAddress?.city}<br />
                          Phone: {o.deliveryAddress?.phone || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#9C968D", marginBottom: 4 }}>ORDER SUMMARY</p>
                        <p style={{ fontSize: 12.5, color: "#23201D" }}>
                          Payment Method: <span style={{ fontWeight: 700, textTransform: "uppercase" }}>{o.payMethod}</span><br />
                          Total Amount: <strong style={{ fontSize: 14, color: "#5E8C77" }}>&#8377;{o.total?.toLocaleString("en-IN")}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <>
          <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 800, backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, maxWidth: "92vw", maxHeight: "90vh", background: "#FFFFFF", zIndex: 850, borderRadius: 24, padding: 24, overflowY: "auto", border: "1px solid #EAE3D9", boxShadow: "0 24px 64px rgba(35,32,29,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#23201D" }}>+ Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="icon-btn" style={{ background: "#F4EFE6", borderRadius: "50%", width: 32, height: 32, border: "none", cursor: "pointer" }}>
                <Icons.Close />
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 4 }}>PRODUCT NAME *</label>
                <input type="text" required placeholder="e.g. Linen Spiral Planner 2027" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 4 }}>CATEGORY</label>
                  <select value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }}>
                    <option value="journals">Journals</option>
                    <option value="planners">Planners</option>
                    <option value="pens">Pens & Ink</option>
                    <option value="workspace">Workspace</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 4 }}>SUBCATEGORY</label>
                  <input type="text" placeholder="e.g. Hardcover" value={newProd.subcategory} onChange={e => setNewProd({ ...newProd, subcategory: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 4 }}>PRICE (&#8377;) *</label>
                  <input type="number" required placeholder="1299" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 4 }}>ORIGINAL PRICE (&#8377;)</label>
                  <input type="number" placeholder="1599" value={newProd.originalPrice} onChange={e => setNewProd({ ...newProd, originalPrice: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 4 }}>IMAGE URL</label>
                <input type="url" placeholder="https://images.unsplash.com/photo-..." value={newProd.imageUrl} onChange={e => setNewProd({ ...newProd, imageUrl: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 4 }}>DESCRIPTION</label>
                <textarea rows={3} placeholder="Write a short description..." value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })} className="field field-sm" style={{ width: "100%", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <input type="checkbox" checked={newProd.inStock} onChange={e => setNewProd({ ...newProd, inStock: e.target.checked })} />
                  In Stock
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <input type="checkbox" checked={newProd.isNew} onChange={e => setNewProd({ ...newProd, isNew: e.target.checked })} />
                  New Arrival
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <input type="checkbox" checked={newProd.isBestseller} onChange={e => setNewProd({ ...newProd, isBestseller: e.target.checked })} />
                  Bestseller
                </label>
              </div>

              <button type="submit" className="btn" style={{ background: "#5E8C77", color: "#FFFFFF", padding: "12px", borderRadius: 12, fontWeight: 700, border: "none", marginTop: 12, cursor: "pointer" }}>
                Add Product to Store Catalog
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
