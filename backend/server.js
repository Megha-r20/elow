import express from "express";
import cors from "cors";
import { PRODUCTS, CATEGORIES, REVIEWS, PRICE_RANGES } from "./data/products.js";

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Handle malformed JSON body errors gracefully
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Malformed JSON payload in request" });
  }
  next(err);
});

// Defensive string helpers
const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());
const safeLower = (v) => safeStr(v).toLowerCase();

// Memory store for placed orders
const ordersStore = new Map();

// Initial sample order for demonstration in Admin Portal
const initialDemoOrder = {
  id: "US-2026-DEMO01",
  items: [
    {
      product: {
        id: "journal-01",
        name: "Linen Hardcover Bullet Journal 160GSM",
        price: 1299,
        category: "journals",
        subcategory: "Hardcover",
        images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"]
      },
      qty: 1
    }
  ],
  deliveryAddress: {
    firstName: "Ritika",
    lastName: "Sharma",
    email: "ritika@example.com",
    phone: "9876543210",
    address: "Flat 4B, Orchid Heights, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  payMethod: "upi",
  subtotal: 1299,
  discount: 0,
  shipping: 0,
  giftCost: 0,
  total: 1299,
  status: "Processing",
  date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  createdAt: new Date().toISOString()
};
ordersStore.set(initialDemoOrder.id, initialDemoOrder);

// Dynamic products list in memory initialized from PRODUCTS array
let productsList = Array.isArray(PRODUCTS) ? [...PRODUCTS] : [];

// Memory store for users
const usersStore = [
  {
    id: "user-admin-1",
    name: "Elow Admin",
    email: "admin@elow.in",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-cust-1",
    name: "Ritika Sharma",
    email: "ritika@example.com",
    password: "password123",
    role: "user",
    createdAt: new Date().toISOString()
  }
];

// Memory store for active sessions/tokens
const tokensStore = new Map([
  ["token_admin_demo", "user-admin-1"],
  ["token_cust_demo", "user-cust-1"]
]);

// Helper to strip sensitive password field
const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "elow-backend", timestamp: new Date().toISOString() });
});

// Auth API - Register
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    const cleanName = safeStr(name);
    const cleanEmail = safeLower(email);
    const cleanPass = safeStr(password);

    if (!cleanName || !cleanEmail || !cleanPass) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = usersStore.find(u => safeLower(u.email) === cleanEmail);
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: role === "admin" ? "admin" : "user",
      createdAt: new Date().toISOString()
    };

    usersStore.push(newUser);
    const token = `token_${newUser.id}_${Date.now()}`;
    tokensStore.set(token, newUser.id);

    console.log(`[User Registered] ${newUser.name} (${newUser.email}) - Role: ${newUser.role}`);
    res.status(201).json({ success: true, user: sanitizeUser(newUser), token });
  } catch (err) {
    console.error("[Register Error]", err);
    res.status(500).json({ error: "Failed to register user account" });
  }
});

// Auth API - Login
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body || {};

    const cleanEmail = safeLower(email);
    const cleanPass = safeStr(password);

    if (!cleanEmail || !cleanPass) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = usersStore.find(
      u => safeLower(u.email) === cleanEmail && String(u.password) === cleanPass
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = `token_${user.id}_${Date.now()}`;
    tokensStore.set(token, user.id);

    console.log(`[User Logged In] ${user.name} (${user.email}) - Role: ${user.role}`);
    res.json({ success: true, user: sanitizeUser(user), token });
  } catch (err) {
    console.error("[Login Error]", err);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
});

// Auth API - Current User
app.get("/api/auth/me", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const userId = tokensStore.get(token);
    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired session token" });
    }

    const user = usersStore.find(u => u.id === userId);
    if (!user) {
      return res.status(401).json({ error: "User profile not found" });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error("[Auth Me Error]", err);
    res.status(500).json({ error: "Failed to fetch active user profile" });
  }
});

// Categories API
app.get("/api/categories", (req, res) => {
  res.json(CATEGORIES || []);
});

// Products List API (supports filtering, searching, and sorting)
app.get("/api/products", (req, res) => {
  try {
    const { cat, q, filter, priceRange, inStock, sort } = req.query;
    let list = [...productsList];

    // Category filter
    if (cat && cat !== "all") {
      list = list.filter(p => p.category === cat);
    }

    // Search query with safe string checks
    if (q && typeof q === "string" && q.trim()) {
      const query = safeLower(q);
      list = list.filter(p => {
        const name = safeLower(p.name);
        const desc = safeLower(p.description);
        const subcat = safeLower(p.subcategory);
        const tags = Array.isArray(p.tags) ? p.tags.map(safeLower) : [];
        return name.includes(query) || desc.includes(query) || subcat.includes(query) || tags.some(t => t.includes(query));
      });
    }

    // Special Filter flags
    if (filter === "new")        list = list.filter(p => Boolean(p.isNew));
    if (filter === "bestseller") list = list.filter(p => Boolean(p.isBestseller));
    if (inStock === "true")      list = list.filter(p => Boolean(p.inStock));

    // Price range filter
    if (priceRange !== undefined && priceRange !== null && priceRange !== "") {
      const idx = parseInt(String(priceRange), 10);
      if (!isNaN(idx) && PRICE_RANGES && PRICE_RANGES[idx]) {
        const r = PRICE_RANGES[idx];
        list = list.filter(p => (p.price || 0) >= r.min && (p.price || 0) <= r.max);
      }
    }

    // Sorting
    switch (sort) {
      case "price-asc":   list.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "price-desc":  list.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case "rating":      list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "newest":      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case "bestselling": list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)); break;
    }

    res.json({ products: list, count: list.length });
  } catch (err) {
    console.error("[Get Products Error]", err);
    res.status(500).json({ error: "Error retrieving product catalog" });
  }
});

// Single Product Details API
app.get("/api/products/:id", (req, res) => {
  try {
    const product = productsList.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const reviews = Array.isArray(REVIEWS) ? REVIEWS.filter(r => r.productId === product.id) : [];
    const related = productsList.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    res.json({ product, reviews, related });
  } catch (err) {
    console.error("[Get Product Detail Error]", err);
    res.status(500).json({ error: "Error fetching product details" });
  }
});

// Admin Product Create API
app.post("/api/admin/products", (req, res) => {
  try {
    const { name, category, subcategory, price, originalPrice, description, images, inStock, isNew, isBestseller } = req.body || {};

    const cleanName = safeStr(name);
    const cleanCategory = safeStr(category);
    const numPrice = Number(price);

    if (!cleanName || !cleanCategory || isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ error: "Valid name, category, and price are required" });
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: cleanName,
      category: cleanCategory,
      subcategory: safeStr(subcategory) || "General",
      price: numPrice,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: safeStr(description) || "Handcrafted aesthetic lifestyle product.",
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"],
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      rating: 5.0,
      reviewCount: 0,
      isNew: isNew !== undefined ? Boolean(isNew) : true,
      isBestseller: Boolean(isBestseller),
      tags: ["New Arrival"]
    };

    productsList.unshift(newProduct);
    console.log(`[Admin Added Product] ${newProduct.name} (${newProduct.id})`);
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error("[Add Product Error]", err);
    res.status(500).json({ error: "Failed to create new product" });
  }
});

// Admin Product Delete API
app.delete("/api/admin/products/:id", (req, res) => {
  try {
    const prodId = req.params.id;
    const initialLen = productsList.length;
    productsList = productsList.filter(p => p.id !== prodId);

    if (productsList.length === initialLen) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log(`[Admin Deleted Product] ID: ${prodId}`);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("[Delete Product Error]", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Admin Get All Orders API
app.get("/api/admin/orders", (req, res) => {
  const orders = Array.from(ordersStore.values());
  res.json({ orders });
});

// Admin Update Order Status API
app.patch("/api/admin/orders/:id/status", (req, res) => {
  try {
    const { status } = req.body || {};
    const order = ordersStore.get(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const cleanStatus = safeStr(status);
    if (!cleanStatus) {
      return res.status(400).json({ error: "Order status is required" });
    }

    order.status = cleanStatus;
    ordersStore.set(order.id, order);

    console.log(`[Admin Updated Order Status] ID: ${order.id} -> Status: ${cleanStatus}`);
    res.json({ success: true, order });
  } catch (err) {
    console.error("[Update Status Error]", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Promo Code Validation API
app.post("/api/promo/validate", (req, res) => {
  try {
    const { code } = req.body || {};
    const cleanCode = safeStr(code).toUpperCase();

    if (!cleanCode) {
      return res.status(400).json({ valid: false, error: "Code is required" });
    }

    if (cleanCode === "WRITE50") {
      return res.json({ valid: true, code: "WRITE50", discountPercent: 10, message: "10% discount applied!" });
    }

    res.status(400).json({ valid: false, error: "Invalid promo code. Try WRITE50." });
  } catch (err) {
    console.error("[Promo Error]", err);
    res.status(500).json({ valid: false, error: "Error validating promo code" });
  }
});

// Orders API (Create or Sync Order)
app.post("/api/orders", (req, res) => {
  try {
    const { id, items, deliveryAddress, payMethod, subtotal, discount, shipping, giftCost, total, status } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }
    if (!deliveryAddress || typeof deliveryAddress !== "object" || !safeStr(deliveryAddress.email) || !safeStr(deliveryAddress.address)) {
      return res.status(400).json({ error: "Valid delivery address and email are required" });
    }

    const orderId = safeStr(id) || `US-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Return existing order if already in memory store (preserves Admin status updates)
    if (ordersStore.has(orderId)) {
      return res.json({ success: true, order: ordersStore.get(orderId) });
    }

    const order = {
      id: orderId,
      items,
      deliveryAddress,
      payMethod: safeStr(payMethod) || "upi",
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      shipping: Number(shipping) || 0,
      giftCost: Number(giftCost) || 0,
      total: Number(total) || 0,
      status: safeStr(status) || "Processing",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      createdAt: new Date().toISOString()
    };

    ordersStore.set(orderId, order);
    console.log(`[Order Registered/Synced] ID: ${orderId}, Total: ₹${order.total}`);

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("[Create Order Error]", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Orders API (Get Order Details)
app.get("/api/orders/:id", (req, res) => {
  try {
    const order = ordersStore.get(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("[Get Order Error]", err);
    res.status(500).json({ error: "Error fetching order details" });
  }
});

// Orders API (Cancel Order by Customer)
app.patch("/api/orders/:id/cancel", (req, res) => {
  try {
    const orderId = req.params.id;
    const order = ordersStore.get(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "Shipped" || order.status === "Delivered") {
      return res.status(400).json({ error: `Cannot cancel order after it has been ${order.status.toLowerCase()}` });
    }

    order.status = "Cancelled";
    ordersStore.set(orderId, order);
    console.log(`[Order Cancelled by Customer] ID: ${orderId}`);

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("[Cancel Order Error]", err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

// Global catch-all 500 error handler middleware
app.use((err, req, res, next) => {
  console.error("[Global Express Error]", err);
  res.status(500).json({ error: err?.message || "Internal server error" });
});

// Global process exception safety handlers
process.on("uncaughtException", (err) => {
  console.error("[Uncaught Process Exception]", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[Unhandled Promise Rejection]", reason);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Elow Backend Express API running on http://localhost:${PORT}`);
});
