import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { PRODUCTS, CATEGORIES, REVIEWS, PRICE_RANGES } from "./data/products.js";
import { Product } from "./models/Product.js";
import { Order } from "./models/Order.js";
import { User } from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const MONGODB_URI = process.env.MONGODB_URI;

// Dynamic CORS configuration for Production (Vercel) and Local Dev
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser agents or matching frontend origins or preview Vercel domains
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback permissive CORS for custom production client domains
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Handle malformed JSON payload errors gracefully
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Malformed JSON payload in request" });
  }
  next(err);
});

// Defensive string helpers
const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());
const safeLower = (v) => safeStr(v).toLowerCase();

// In-memory fallback stores
let productsListMemory = Array.isArray(PRODUCTS) ? [...PRODUCTS] : [];
const tokensStore = new Map([
  ["token_admin_demo", "user-admin-1"],
  ["token_cust_demo", "user-cust-1"],
]);

const initialUsers = [
  {
    id: "user-admin-1",
    name: "Elow Admin",
    email: "admin@elow.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "user-cust-1",
    name: "Ritika Sharma",
    email: "ritika@example.com",
    password: "user123",
    role: "user",
  },
];

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
        images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"],
      },
      qty: 1,
    },
  ],
  deliveryAddress: {
    firstName: "Ritika",
    lastName: "Sharma",
    email: "ritika@example.com",
    phone: "9876543210",
    address: "Flat 4B, Orchid Heights, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
  },
  payMethod: "upi",
  subtotal: 1299,
  discount: 0,
  shipping: 0,
  giftCost: 0,
  total: 1299,
  status: "Processing",
  date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
};

// Mongoose lifecycle listeners
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Atlas Connection Error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB Atlas Disconnected. Reconnecting...");
});

mongoose.connection.on("reconnected", () => {
  console.log("🟢 MongoDB Atlas Reconnected!");
});

// Connect to MongoDB Atlas & seed default catalog
async function connectDBAndSeed() {
  if (!MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI environment variable is not defined.");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });
    console.log("🟢 Connected to MongoDB Atlas successfully!");

    // Seed products catalog if collection is empty
    const count = await Product.countDocuments();
    if (count === 0 && Array.isArray(PRODUCTS) && PRODUCTS.length > 0) {
      console.log(`🌱 Seeding ${PRODUCTS.length} stationery items into MongoDB Atlas...`);
      await Product.insertMany(PRODUCTS);
      console.log("✅ Seeded products into MongoDB Atlas successfully!");
    } else {
      console.log(`📦 MongoDB Atlas contains ${count} products.`);
    }

    // Seed initial users if collection is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(initialUsers);
      console.log("✅ Seeded default admin/user accounts into MongoDB Atlas!");
    }

    // Seed initial demo order if collection is empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create(initialDemoOrder);
      console.log("✅ Seeded initial demo order into MongoDB Atlas!");
    }
  } catch (err) {
    console.error("❌ MongoDB Atlas initial connection error:", err.message);
  }
}

connectDBAndSeed();

// Helper to strip sensitive password field
const sanitizeUser = (user) => {
  if (!user) return null;
  const raw = typeof user.toObject === "function" ? user.toObject() : user;
  const { password, _id, __v, ...safeUser } = raw;
  return safeUser;
};

// Health Check API
app.get("/api/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    service: "elow-backend",
    environment: process.env.NODE_ENV || "development",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Auth API - Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    const cleanName = safeStr(name);
    const cleanEmail = safeLower(email);
    const cleanPass = safeStr(password);

    if (!cleanName || !cleanEmail || !cleanPass) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    let existingUser = null;
    if (mongoose.connection.readyState === 1) {
      existingUser = await User.findOne({ email: cleanEmail }).lean();
    }
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const userData = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: role === "admin" ? "admin" : "user",
    };

    let newUser = userData;
    if (mongoose.connection.readyState === 1) {
      newUser = await User.create(userData);
    }

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
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const cleanEmail = safeLower(email);
    const cleanPass = safeStr(password);

    if (!cleanEmail || !cleanPass) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail, password: cleanPass }).lean();
    } else {
      user = initialUsers.find((u) => u.email === cleanEmail && u.password === cleanPass);
    }

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
app.get("/api/auth/me", async (req, res) => {
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

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ id: userId }).lean();
    } else {
      user = initialUsers.find((u) => u.id === userId);
    }

    if (!user) {
      return res.status(401).json({ error: "User profile not found" });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error("[Auth Me Error]", err);
    res.status(500).json({ error: "Failed to fetch active user profile" });
  }
});

// Auth API - Update Profile & Password
app.patch("/api/auth/profile", async (req, res) => {
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

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ id: userId });
    }

    if (!user) {
      return res.status(401).json({ error: "User profile not found" });
    }

    const { name, email, phone, bio, avatar, address, currentPassword, newPassword } = req.body || {};

    if (name) {
      const cleanName = safeStr(name);
      if (cleanName) user.name = cleanName;
    }

    if (email) {
      const cleanEmail = safeLower(email);
      if (cleanEmail && cleanEmail !== safeLower(user.email)) {
        const existing = await User.findOne({ id: { $ne: user.id }, email: cleanEmail }).lean();
        if (existing) {
          return res.status(400).json({ error: "An account with this email already exists" });
        }
        user.email = cleanEmail;
      }
    }

    if (phone !== undefined) user.phone = safeStr(phone);
    if (bio !== undefined) user.bio = safeStr(bio);
    if (avatar !== undefined) user.avatar = safeStr(avatar);
    if (address !== undefined) user.address = safeStr(address);

    if (newPassword) {
      const cleanCurrent = safeStr(currentPassword);
      const cleanNew = safeStr(newPassword);

      if (!cleanCurrent) {
        return res.status(400).json({ error: "Current password is required to set a new password" });
      }

      if (String(user.password) !== cleanCurrent) {
        return res.status(400).json({ error: "Incorrect current password" });
      }

      if (cleanNew.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long" });
      }

      user.password = cleanNew;
    }

    await user.save();
    console.log(`[User Updated Profile] ${user.name} (${user.email})`);
    res.json({ success: true, user: sanitizeUser(user), message: "Profile updated successfully" });
  } catch (err) {
    console.error("[Update Profile Error]", err);
    res.status(500).json({ error: "Failed to update profile settings" });
  }
});

// Categories API
app.get("/api/categories", (req, res) => {
  res.json(CATEGORIES || []);
});

// Products List API (Queries MongoDB Atlas with fallback to memory)
app.get("/api/products", async (req, res) => {
  try {
    const { cat, q, filter, priceRange, inStock, sort } = req.query;

    let products = [];
    if (mongoose.connection.readyState === 1) {
      products = await Product.find({}).lean();
    } else {
      products = [...productsListMemory];
    }

    let list = [...products];

    // Category filter
    if (cat && cat !== "all") {
      list = list.filter((p) => p.category === cat);
    }

    // Search query
    if (q && typeof q === "string" && q.trim()) {
      const query = safeLower(q);
      list = list.filter((p) => {
        const name = safeLower(p.name);
        const desc = safeLower(p.description);
        const subcat = safeLower(p.subcategory);
        const tags = Array.isArray(p.tags) ? p.tags.map(safeLower) : [];
        return (
          name.includes(query) ||
          desc.includes(query) ||
          subcat.includes(query) ||
          tags.some((t) => t.includes(query))
        );
      });
    }

    // Special Filter flags
    if (filter === "new") list = list.filter((p) => Boolean(p.isNew));
    if (filter === "bestseller") list = list.filter((p) => Boolean(p.isBestseller));
    if (inStock === "true") list = list.filter((p) => Boolean(p.inStock));

    // Price range filter
    if (priceRange !== undefined && priceRange !== null && priceRange !== "") {
      const idx = parseInt(String(priceRange), 10);
      if (!isNaN(idx) && PRICE_RANGES && PRICE_RANGES[idx]) {
        const r = PRICE_RANGES[idx];
        list = list.filter((p) => (p.price || 0) >= r.min && (p.price || 0) <= r.max);
      }
    }

    // Sorting
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "bestselling":
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    res.json({ products: list, count: list.length });
  } catch (err) {
    console.error("[Get Products Error]", err);
    res.status(500).json({ error: "Error retrieving product catalog" });
  }
});

// Single Product Details API
app.get("/api/products/:id", async (req, res) => {
  try {
    let product = null;
    let related = [];

    if (mongoose.connection.readyState === 1) {
      product = await Product.findOne({ id: req.params.id }).lean();
      if (product) {
        related = await Product.find({ category: product.category, id: { $ne: product.id } })
          .limit(4)
          .lean();
      }
    } else {
      product = productsListMemory.find((p) => p.id === req.params.id);
      if (product) {
        related = productsListMemory
          .filter((p) => p.category === product.category && p.id !== product.id)
          .slice(0, 4);
      }
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const reviews = Array.isArray(REVIEWS) ? REVIEWS.filter((r) => r.productId === product.id) : [];
    res.json({ product, reviews, related });
  } catch (err) {
    console.error("[Get Product Detail Error]", err);
    res.status(500).json({ error: "Error fetching product details" });
  }
});

// Admin Product Create API (Saves to MongoDB Atlas)
app.post("/api/admin/products", async (req, res) => {
  try {
    const { name, category, subcategory, price, originalPrice, description, images, inStock, isNew, isBestseller } =
      req.body || {};

    const cleanName = safeStr(name);
    const cleanCategory = safeStr(category);
    const numPrice = Number(price);

    if (!cleanName || !cleanCategory || isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ error: "Valid name, category, and price are required" });
    }

    const newProductData = {
      id: `prod-${Date.now()}`,
      name: cleanName,
      shortName: cleanName,
      category: cleanCategory,
      subcategory: safeStr(subcategory) || "General",
      price: numPrice,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: safeStr(description) || "Handcrafted aesthetic lifestyle product.",
      images:
        Array.isArray(images) && images.length > 0
          ? images
          : ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"],
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      rating: 5.0,
      reviewCount: 0,
      isNew: isNew !== undefined ? Boolean(isNew) : true,
      isBestseller: Boolean(isBestseller),
      tags: ["New Arrival"],
    };

    let newProduct = newProductData;
    if (mongoose.connection.readyState === 1) {
      newProduct = await Product.create(newProductData);
    } else {
      productsListMemory.unshift(newProductData);
    }

    console.log(`[Admin Added Product to MongoDB Atlas] ${newProduct.name} (${newProduct.id})`);
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error("[Add Product Error]", err);
    res.status(500).json({ error: "Failed to create new product" });
  }
});

// Admin Product Delete API (Deletes from MongoDB Atlas)
app.delete("/api/admin/products/:id", async (req, res) => {
  try {
    const prodId = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const deleted = await Product.findOneAndDelete({ id: prodId });
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
    } else {
      const initialLen = productsListMemory.length;
      productsListMemory = productsListMemory.filter((p) => p.id !== prodId);
      if (productsListMemory.length === initialLen) {
        return res.status(404).json({ error: "Product not found" });
      }
    }

    console.log(`[Admin Deleted Product from MongoDB Atlas] ID: ${prodId}`);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("[Delete Product Error]", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Admin Product Edit / Update API (Updates MongoDB Atlas)
app.put("/api/admin/products/:id", async (req, res) => {
  try {
    const prodId = req.params.id;
    const { name, category, subcategory, price, originalPrice, description, images, inStock, isNew, isBestseller } =
      req.body || {};

    const cleanName = safeStr(name);
    const cleanCategory = safeStr(category);
    const numPrice = Number(price);

    if (!cleanName || !cleanCategory || isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ error: "Valid name, category, and price are required" });
    }

    const updateFields = {
      name: cleanName,
      shortName: cleanName,
      category: cleanCategory,
      subcategory: safeStr(subcategory) || "General",
      price: numPrice,
      originalPrice:
        originalPrice !== undefined && originalPrice !== "" && !isNaN(Number(originalPrice))
          ? Number(originalPrice)
          : undefined,
      description: safeStr(description),
      images: Array.isArray(images) && images.length > 0 ? images : undefined,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      isNew: isNew !== undefined ? Boolean(isNew) : false,
      isBestseller: isBestseller !== undefined ? Boolean(isBestseller) : false,
    };

    let updatedProduct = null;
    if (mongoose.connection.readyState === 1) {
      updatedProduct = await Product.findOneAndUpdate({ id: prodId }, updateFields, { new: true }).lean();
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
    } else {
      const idx = productsListMemory.findIndex((p) => p.id === prodId);
      if (idx === -1) {
        return res.status(404).json({ error: "Product not found" });
      }
      productsListMemory[idx] = { ...productsListMemory[idx], ...updateFields };
      updatedProduct = productsListMemory[idx];
    }

    console.log(`[Admin Updated Product in MongoDB Atlas] ${updatedProduct.name} (${updatedProduct.id})`);
    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    console.error("[Edit Product Error]", err);
    res.status(500).json({ error: "Failed to update product details" });
  }
});

// Admin Get All Orders API (Reads from MongoDB Atlas)
app.get("/api/admin/orders", async (req, res) => {
  try {
    let orders = [];
    if (mongoose.connection.readyState === 1) {
      orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    }
    res.json({ orders });
  } catch (err) {
    console.error("[Get Orders Error]", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin Update Order Status API (Updates MongoDB Atlas)
app.patch("/api/admin/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body || {};
    const cleanStatus = safeStr(status);

    if (!cleanStatus) {
      return res.status(400).json({ error: "Order status is required" });
    }

    let updatedOrder = null;
    if (mongoose.connection.readyState === 1) {
      updatedOrder = await Order.findOneAndUpdate({ id: req.params.id }, { status: cleanStatus }, { new: true }).lean();
    }

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    console.log(`[Admin Updated Order Status in MongoDB Atlas] ID: ${updatedOrder.id} -> ${cleanStatus}`);
    res.json({ success: true, order: updatedOrder });
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

    const validCodes = ["WRITE50", "ELOW10", "SPIN50", "SPIN100", "SPIN150", "SPIN250", "SPIN10"];
    if (validCodes.includes(cleanCode)) {
      return res.json({ valid: true, code: cleanCode, message: `Promo code ${cleanCode} applied!` });
    }

    res.status(400).json({ valid: false, error: "Invalid promo code" });
  } catch (err) {
    console.error("[Promo Error]", err);
    res.status(500).json({ valid: false, error: "Error validating promo code" });
  }
});

// Orders API (Create Order in MongoDB Atlas)
app.post("/api/orders", async (req, res) => {
  try {
    const { id, items, deliveryAddress, payMethod, subtotal, discount, shipping, giftCost, total, status } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }
    if (!deliveryAddress || typeof deliveryAddress !== "object" || !safeStr(deliveryAddress.email) || !safeStr(deliveryAddress.address)) {
      return res.status(400).json({ error: "Valid delivery address and email are required" });
    }

    const orderId = safeStr(id) || `US-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (mongoose.connection.readyState === 1) {
      const existing = await Order.findOne({ id: orderId }).lean();
      if (existing) {
        return res.json({ success: true, order: existing });
      }
    }

    const orderData = {
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
    };

    let newOrder = orderData;
    if (mongoose.connection.readyState === 1) {
      newOrder = await Order.create(orderData);
    }

    console.log(`[Order Created in MongoDB Atlas] ID: ${orderId}, Total: ₹${newOrder.total}`);
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("[Create Order Error]", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Orders API (Get Order Details from MongoDB Atlas)
app.get("/api/orders/:id", async (req, res) => {
  try {
    let order = null;
    if (mongoose.connection.readyState === 1) {
      order = await Order.findOne({ id: req.params.id }).lean();
    }
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("[Get Order Error]", err);
    res.status(500).json({ error: "Error fetching order details" });
  }
});

// Orders API (Cancel Order by Customer in MongoDB Atlas)
app.patch("/api/orders/:id/cancel", async (req, res) => {
  try {
    const orderId = req.params.id;
    let order = null;

    if (mongoose.connection.readyState === 1) {
      order = await Order.findOne({ id: orderId });
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "Shipped" || order.status === "Delivered") {
      return res.status(400).json({ error: `Cannot cancel order after it has been ${order.status.toLowerCase()}` });
    }

    order.status = "Cancelled";
    await order.save();
    console.log(`[Order Cancelled in MongoDB Atlas] ID: ${orderId}`);

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("[Cancel Order Error]", err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

// Global catch-all 500 error handler middleware
app.use((err, req, res, next) => {
  console.error("[Global Express Error]", err);
  res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal server error" : err?.message });
});

// Graceful termination handling for Render containers
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Elow Backend Express API running on http://0.0.0.0:${PORT}`);
});

const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down server gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
    }
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
