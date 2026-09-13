import express from "express";
import cors from "cors";
import { PRODUCTS, CATEGORIES, REVIEWS, PRICE_RANGES } from "./data/products.js";

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

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
let productsList = [...PRODUCTS];

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

// Helper to strip sensitive data
const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "elow-backend", timestamp: new Date().toISOString() });
});

// Auth API - Register
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const existingUser = usersStore.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password,
    role: role === "admin" ? "admin" : "user",
    createdAt: new Date().toISOString()
  };

  usersStore.push(newUser);
  const token = `token_${newUser.id}_${Date.now()}`;
  tokensStore.set(token, newUser.id);

  console.log(`[User Registered] ${newUser.name} (${newUser.email}) - Role: ${newUser.role}`);
  res.status(201).json({ success: true, user: sanitizeUser(newUser), token });
});

// Auth API - Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = usersStore.find(
    u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = `token_${user.id}_${Date.now()}`;
  tokensStore.set(token, user.id);

  console.log(`[User Logged In] ${user.name} (${user.email}) - Role: ${user.role}`);
  res.json({ success: true, user: sanitizeUser(user), token });
});

// Auth API - Current User
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const userId = tokensStore.get(token);
  if (!userId) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const user = usersStore.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  res.json({ user: sanitizeUser(user) });
});

// Categories API
app.get("/api/categories", (req, res) => {
  res.json(CATEGORIES);
});

// Products List API (supports filtering, searching, and sorting)
app.get("/api/products", (req, res) => {
  const { cat, q, filter, priceRange, inStock, sort } = req.query;
  let list = [...productsList];

  // Category filter
  if (cat && cat !== "all") {
    list = list.filter(p => p.category === cat);
  }

  // Search query
  if (q && typeof q === "string" && q.trim()) {
    const query = q.toLowerCase().trim();
    list = list.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.subcategory.toLowerCase().includes(query) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  // Special Filter flags
  if (filter === "new")       list = list.filter(p => p.isNew);
  if (filter === "bestseller") list = list.filter(p => p.isBestseller);
  if (inStock === "true")     list = list.filter(p => p.inStock);

  // Price range filter
  if (priceRange !== undefined && priceRange !== null && priceRange !== "") {
    const idx = parseInt(priceRange, 10);
    if (!isNaN(idx) && PRICE_RANGES[idx]) {
      const r = PRICE_RANGES[idx];
      list = list.filter(p => p.price >= r.min && p.price <= r.max);
    }
  }

  // Sorting
  switch (sort) {
    case "price-asc":   list.sort((a, b) => a.price - b.price); break;
    case "price-desc":  list.sort((a, b) => b.price - a.price); break;
    case "rating":      list.sort((a, b) => b.rating - a.rating); break;
    case "newest":      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case "bestselling": list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)); break;
  }

  res.json({ products: list, count: list.length });
});

// Single Product Details API
app.get("/api/products/:id", (req, res) => {
  const product = productsList.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const reviews = REVIEWS.filter(r => r.productId === product.id);
  const related = productsList.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  res.json({ product, reviews, related });
});

// Admin Product Create API
app.post("/api/admin/products", (req, res) => {
  const { name, category, subcategory, price, originalPrice, description, images, inStock, isNew, isBestseller } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: "Name, category, and price are required" });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    category,
    subcategory: subcategory || "General",
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    description: description || "Handcrafted aesthetic lifestyle product.",
    images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"],
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
});

// Admin Product Delete API
app.delete("/api/admin/products/:id", (req, res) => {
  const prodId = req.params.id;
  const initialLen = productsList.length;
  productsList = productsList.filter(p => p.id !== prodId);

  if (productsList.length === initialLen) {
    return res.status(404).json({ error: "Product not found" });
  }

  console.log(`[Admin Deleted Product] ID: ${prodId}`);
  res.json({ success: true, message: "Product deleted successfully" });
});

// Admin Get All Orders API
app.get("/api/admin/orders", (req, res) => {
  const orders = Array.from(ordersStore.values());
  res.json({ orders });
});

// Admin Update Order Status API
app.patch("/api/admin/orders/:id/status", (req, res) => {
  const { status } = req.body;
  const order = ordersStore.get(req.params.id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  order.status = status;
  ordersStore.set(order.id, order);

  console.log(`[Admin Updated Order Status] ID: ${order.id} -> Status: ${status}`);
  res.json({ success: true, order });
});

// Promo Code Validation API
app.post("/api/promo/validate", (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, error: "Code is required" });
  }

  if (code.trim().toUpperCase() === "WRITE50") {
    return res.json({ valid: true, code: "WRITE50", discountPercent: 10, message: "10% discount applied!" });
  }

  res.status(400).json({ valid: false, error: "Invalid promo code. Try WRITE50." });
});

// Orders API (Create or Sync Order)
app.post("/api/orders", (req, res) => {
  const { id, items, deliveryAddress, payMethod, subtotal, discount, shipping, giftCost, total, status } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart items are required" });
  }
  if (!deliveryAddress || !deliveryAddress.email || !deliveryAddress.address) {
    return res.status(400).json({ error: "Valid delivery address is required" });
  }

  const orderId = id || `US-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Return existing order if already in memory store (preserves Admin status updates)
  if (ordersStore.has(orderId)) {
    return res.json({ success: true, order: ordersStore.get(orderId) });
  }

  const order = {
    id: orderId,
    items,
    deliveryAddress,
    payMethod: payMethod || "upi",
    subtotal: subtotal || 0,
    discount: discount || 0,
    shipping: shipping || 0,
    giftCost: giftCost || 0,
    total: total || 0,
    status: status || "Processing",
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    createdAt: new Date().toISOString()
  };

  ordersStore.set(orderId, order);
  console.log(`[Order Registered/Synced] ID: ${orderId}, Total: ₹${order.total}`);

  res.status(201).json({ success: true, order });
});

// Orders API (Get Order Details)
app.get("/api/orders/:id", (req, res) => {
  const order = ordersStore.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

// Orders API (Cancel Order by Customer)
app.patch("/api/orders/:id/cancel", (req, res) => {
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
});


app.listen(PORT, () => {
  console.log(`🚀 Elow Backend Express API running on http://localhost:${PORT}`);
});

