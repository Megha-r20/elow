import express from "express";
import cors from "cors";
import { PRODUCTS, CATEGORIES, REVIEWS, PRICE_RANGES } from "./data/products.js";

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Memory store for placed orders
const ordersStore = new Map();

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "elow-backend", timestamp: new Date().toISOString() });
});

// Categories API
app.get("/api/categories", (req, res) => {
  res.json(CATEGORIES);
});

// Products List API (supports filtering, searching, and sorting)
app.get("/api/products", (req, res) => {
  const { cat, q, filter, priceRange, inStock, sort } = req.query;
  let list = [...PRODUCTS];

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
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const reviews = REVIEWS.filter(r => r.productId === product.id);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  res.json({ product, reviews, related });
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

// Orders API (Create Order)
app.post("/api/orders", (req, res) => {
  const { items, deliveryAddress, payMethod, subtotal, discount, shipping, giftCost, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart items are required" });
  }
  if (!deliveryAddress || !deliveryAddress.email || !deliveryAddress.address) {
    return res.status(400).json({ error: "Valid delivery address is required" });
  }

  const orderId = `US-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
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
    status: "Processing",
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    createdAt: new Date().toISOString()
  };

  ordersStore.set(orderId, order);
  console.log(`[Order Placed] ID: ${orderId}, Total: ₹${order.total}`);

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

app.listen(PORT, () => {
  console.log(`🚀 Elow Backend Express API running on http://localhost:${PORT}`);
});
