import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PRODUCTS, CATEGORIES, REVIEWS, PRICE_RANGES } from "./data/products.js";
import { Product } from "./models/Product.js";
import { Order } from "./models/Order.js";
import { User } from "./models/User.js";
import { Review } from "./models/Review.js";
import { PromoCode } from "./models/PromoCode.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "elow_jwt_secret_key_2026_super_secure_change_in_prod";
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Apply Helmet security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many authentication requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dynamic CORS configuration for Production (Vercel) and Local Dev
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173", "https://elow-store.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(null, true);
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
let reviewsListMemory = Array.isArray(REVIEWS) ? [...REVIEWS] : [];

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "30d" });
};

// Protect middleware (JWT verification)
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ error: "Not authorized, no session token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ id: decoded.id }).lean();
    } else {
      user = initialUsers.find((u) => u.id === decoded.id);
    }
    if (!user) {
      return res.status(401).json({ error: "User profile not found or expired session" });
    }
    req.user = sanitizeUser(user);
    req.userRaw = user;
    next();
  } catch (err) {
    console.error("[JWT Protect Error]", err.message);
    return res.status(401).json({ error: "Not authorized, invalid session token" });
  }
};

// Admin middleware (checks role === "admin")
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Administrator privileges required." });
  }
};

const initialUsers = [
  {
    id: "user-admin-1",
    name: "Elow Admin",
    email: "admin@elow.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: "user-admin-2",
    name: "Elow Admin IN",
    email: "admin@elow.in",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: "user-cust-1",
    name: "Ritika Sharma",
    email: "ritika@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user",
  },
  {
    id: "user-cust-2",
    name: "Elow Customer",
    email: "user@elow.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
  },
];

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

// Root API Welcome Endpoint
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "online",
    name: "Elow Backend REST API",
    database: dbStatus,
    endpoints: {
      health: "/api/health",
      products: "/api/products",
      categories: "/api/categories",
    },
    message: "🌸 Elow backend service is running smoothly on Render!",
  });
});

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
app.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    const cleanName = safeStr(name);
    const cleanEmail = safeLower(email);
    const cleanPass = safeStr(password);

    if (!cleanName || !cleanEmail || !cleanPass) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (cleanPass.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    let existingUser = null;
    if (mongoose.connection.readyState === 1) {
      existingUser = await User.findOne({ email: cleanEmail }).lean();
    } else {
      existingUser = initialUsers.find((u) => u.email === cleanEmail);
    }
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(cleanPass, 10);
    const userId = `user-${Date.now()}`;
    const userData = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "user", // Stop accepting role from body, force user
    };

    let newUser = userData;
    if (mongoose.connection.readyState === 1) {
      newUser = await User.create(userData);
    } else {
      initialUsers.push(userData);
    }

    const token = generateToken(newUser.id, newUser.role);

    console.log(`[User Registered] ${newUser.name} (${newUser.email}) - Role: ${newUser.role}`);
    res.status(201).json({ success: true, user: sanitizeUser(newUser), token });
  } catch (err) {
    console.error("[Register Error]", err);
    res.status(500).json({ error: "Failed to register user account" });
  }
});

// Auth API - Login
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const cleanEmail = safeLower(email);
    const cleanPass = safeStr(password);

    if (!cleanEmail || !cleanPass) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail }).lean();
    } else {
      user = initialUsers.find((u) => u.email === cleanEmail);
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password with bcrypt, falling back to string match if unhashed legacy
    const isPasswordMatch = await bcrypt.compare(cleanPass, user.password).catch(() => false) || user.password === cleanPass;

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id, user.role);

    console.log(`[User Logged In] ${user.name} (${user.email}) - Role: ${user.role}`);
    res.json({ success: true, user: sanitizeUser(user), token });
  } catch (err) {
    console.error("[Login Error]", err);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
});

// Auth API - Current User
app.get("/api/auth/me", protect, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error("[Auth Me Error]", err);
    res.status(500).json({ error: "Failed to fetch active user profile" });
  }
});

// Auth API - Update Profile & Password
app.patch("/api/auth/profile", protect, async (req, res) => {
  try {
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ id: req.user.id });
    } else {
      user = initialUsers.find((u) => u.id === req.user.id);
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
        let existing = null;
        if (mongoose.connection.readyState === 1) {
          existing = await User.findOne({ id: { $ne: user.id }, email: cleanEmail }).lean();
        } else {
          existing = initialUsers.find((u) => u.id !== user.id && u.email === cleanEmail);
        }
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

      const isCurrentValid = await bcrypt.compare(cleanCurrent, user.password).catch(() => false) || user.password === cleanCurrent;
      if (!isCurrentValid) {
        return res.status(400).json({ error: "Incorrect current password" });
      }

      if (cleanNew.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long" });
      }

      user.password = await bcrypt.hash(cleanNew, 10);
    }

    if (mongoose.connection.readyState === 1 && typeof user.save === "function") {
      await user.save();
    }
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

    let reviews = Array.isArray(REVIEWS) ? REVIEWS.filter((r) => r.productId === product.id) : [];
    if (mongoose.connection.readyState === 1) {
      const dbReviews = await Review.find({ productId: product.id }).sort({ createdAt: -1 }).lean();
      if (dbReviews && dbReviews.length > 0) {
        reviews = [...dbReviews, ...reviews];
      }
    }

    res.json({ product, reviews, related });
  } catch (err) {
    console.error("[Get Product Detail Error]", err);
    res.status(500).json({ error: "Error fetching product details" });
  }
});

// Admin Product Create API (Saves to MongoDB Atlas)
app.post("/api/admin/products", protect, admin, async (req, res) => {
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
app.delete("/api/admin/products/:id", protect, admin, async (req, res) => {
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
app.put("/api/admin/products/:id", protect, admin, async (req, res) => {
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
app.get("/api/admin/orders", protect, admin, async (req, res) => {
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
app.patch("/api/admin/orders/:id/status", protect, admin, async (req, res) => {
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

// Admin Delete All Orders API (Deletes all orders from MongoDB Atlas)
app.delete("/api/admin/orders", protect, admin, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Order.deleteMany({});
    }
    console.log("[Admin Cleared All Orders from MongoDB Atlas]");
    res.json({ success: true, message: "All orders cleared successfully" });
  } catch (err) {
    console.error("[Clear All Orders Error]", err);
    res.status(500).json({ error: "Failed to clear store orders" });
  }
});

// Admin Delete Single Order API (Deletes specific order from MongoDB Atlas)
app.delete("/api/admin/orders/:id", protect, admin, async (req, res) => {
  try {
    const orderId = req.params.id;
    if (mongoose.connection.readyState === 1) {
      const deleted = await Order.findOneAndDelete({ id: orderId });
      if (!deleted) {
        return res.status(404).json({ error: "Order not found" });
      }
    }
    console.log(`[Admin Deleted Order from MongoDB Atlas] ID: ${orderId}`);
    res.json({ success: true, message: `Order #${orderId} deleted successfully` });
  } catch (err) {
    console.error("[Delete Single Order Error]", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Stripe Payment Intent API
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "inr" } = req.body || {};
    if (!stripe) {
      return res.status(400).json({ error: "Stripe is not configured on backend." });
    }
    const numAmount = Math.round(Number(amount) * 100);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: numAmount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("[Stripe PaymentIntent Error]", err.message);
    res.status(500).json({ error: err.message || "Failed to create Stripe payment intent" });
  }
});

// Helper to calculate server-side promo discount
const calculatePromoDiscount = async (code, subtotal) => {
  if (!code) return 0;
  const cleanCode = safeStr(code).toUpperCase();

  let promo = null;
  if (mongoose.connection.readyState === 1) {
    promo = await PromoCode.findOne({ code: cleanCode, isActive: true }).lean();
  }

  if (!promo) {
    const fallbackPromos = {
      WRITE50: { discountType: "fixed", discountValue: 50, minOrderAmount: 0 },
      ELOW10: { discountType: "percentage", discountValue: 10, minOrderAmount: 0 },
      SPIN50: { discountType: "fixed", discountValue: 50, minOrderAmount: 0 },
      SPIN100: { discountType: "fixed", discountValue: 100, minOrderAmount: 0 },
      SPIN150: { discountType: "fixed", discountValue: 150, minOrderAmount: 0 },
      SPIN250: { discountType: "fixed", discountValue: 250, minOrderAmount: 0 },
      SPIN10: { discountType: "fixed", discountValue: 10, minOrderAmount: 0 },
    };
    promo = fallbackPromos[cleanCode];
  }

  if (!promo) return 0;
  if (subtotal < (promo.minOrderAmount || 0)) return 0;

  if (promo.discountType === "percentage") {
    let disc = Math.round((subtotal * promo.discountValue) / 100);
    if (promo.maxDiscount && disc > promo.maxDiscount) {
      disc = promo.maxDiscount;
    }
    return Math.min(disc, subtotal);
  } else {
    return Math.min(promo.discountValue, subtotal);
  }
};

// Promo Code Validation API
app.post("/api/promo/validate", async (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body || {};
    const cleanCode = safeStr(code).toUpperCase();

    if (!cleanCode) {
      return res.status(400).json({ valid: false, error: "Promo code is required" });
    }

    let promo = null;
    if (mongoose.connection.readyState === 1) {
      promo = await PromoCode.findOne({ code: cleanCode, isActive: true }).lean();
    }

    if (!promo) {
      const fallbackPromos = {
        WRITE50: { discountType: "fixed", discountValue: 50, minOrderAmount: 0 },
        ELOW10: { discountType: "percentage", discountValue: 10, minOrderAmount: 0 },
        SPIN50: { discountType: "fixed", discountValue: 50, minOrderAmount: 0 },
        SPIN100: { discountType: "fixed", discountValue: 100, minOrderAmount: 0 },
        SPIN150: { discountType: "fixed", discountValue: 150, minOrderAmount: 0 },
        SPIN250: { discountType: "fixed", discountValue: 250, minOrderAmount: 0 },
        SPIN10: { discountType: "fixed", discountValue: 10, minOrderAmount: 0 },
      };
      promo = fallbackPromos[cleanCode];
    }

    if (!promo) {
      return res.status(400).json({ valid: false, error: "Invalid promo code" });
    }

    const discountAmount = await calculatePromoDiscount(cleanCode, Number(subtotal) || 1000);
    res.json({
      valid: true,
      code: cleanCode,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discountAmount,
      message: `Promo code ${cleanCode} applied!`,
    });
  } catch (err) {
    console.error("[Promo Error]", err);
    res.status(500).json({ valid: false, error: "Error validating promo code" });
  }
});

// Orders API - Create Order (Requires Auth, Server-side pricing, Stock checking & reduction, Stripe verification)
app.post("/api/orders", protect, async (req, res) => {
  try {
    const { id, items, deliveryAddress, payMethod, promoCode, giftWrap, stripePaymentIntentId } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }
    if (!deliveryAddress || typeof deliveryAddress !== "object" || !safeStr(deliveryAddress.email) || !safeStr(deliveryAddress.address)) {
      return res.status(400).json({ error: "Valid delivery address and email are required" });
    }

    const productIds = items.map((i) => i.product?.id || i.productId || i.id).filter(Boolean);

    let dbProducts = [];
    if (mongoose.connection.readyState === 1) {
      dbProducts = await Product.find({ id: { $in: productIds } }).lean();
    } else {
      dbProducts = productsListMemory.filter((p) => productIds.includes(p.id));
    }

    let serverSubtotal = 0;
    const sanitizedItems = [];

    // Calculate subtotal from DB prices & verify stock
    for (const item of items) {
      const prodId = item.product?.id || item.productId || item.id;
      const qty = Math.max(1, Number(item.qty || item.quantity || 1));
      const dbProduct = dbProducts.find((p) => p.id === prodId);

      if (!dbProduct) {
        return res.status(400).json({ error: `Product not found: ${prodId}` });
      }

      // Stock verification
      const currentStock = dbProduct.stockCount !== undefined ? Number(dbProduct.stockCount) : 10;
      if (dbProduct.inStock === false || currentStock < qty) {
        return res.status(400).json({
          error: `Product "${dbProduct.name}" is out of stock or has insufficient quantity. (Requested: ${qty}, Available: ${currentStock})`,
        });
      }

      const unitPrice = Number(dbProduct.price);
      serverSubtotal += unitPrice * qty;

      sanitizedItems.push({
        product: {
          id: dbProduct.id,
          name: dbProduct.name,
          price: unitPrice,
          images: dbProduct.images || [],
          category: dbProduct.category,
        },
        qty,
      });
    }

    // Server-side financial calculations
    const serverDiscount = await calculatePromoDiscount(promoCode, serverSubtotal);
    const serverShipping = serverSubtotal >= 999 ? 0 : 79;
    const serverGiftCost = giftWrap ? 49 : 0;
    const serverTotal = Math.max(0, serverSubtotal - serverDiscount + serverShipping + serverGiftCost);

    // Verify Stripe Payment Status if card payment
    let paymentStatus = "Pending";
    if (payMethod === "card") {
      if (stripePaymentIntentId) {
        if (!stripe) {
          return res.status(400).json({ error: "Stripe payment service is not configured on backend." });
        }
        const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);
        if (!paymentIntent || paymentIntent.status !== "succeeded") {
          return res.status(400).json({ error: "Payment verification failed. Stripe payment intent was not completed." });
        }
        paymentStatus = "Paid";
      } else {
        paymentStatus = "Paid";
      }
    } else {
      paymentStatus = payMethod === "upi" ? "Paid" : "Pending";
    }

    const orderId = safeStr(id) || `US-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const orderData = {
      id: orderId,
      userId: req.user.id,
      items: sanitizedItems,
      deliveryAddress,
      payMethod: safeStr(payMethod) || "upi",
      promoCode: safeStr(promoCode),
      paymentStatus,
      stripePaymentIntentId: safeStr(stripePaymentIntentId),
      subtotal: serverSubtotal,
      discount: serverDiscount,
      shipping: serverShipping,
      giftCost: serverGiftCost,
      total: serverTotal,
      status: "Processing",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };

    let newOrder = orderData;
    if (mongoose.connection.readyState === 1) {
      newOrder = await Order.create(orderData);

      // Decrement stock in database after order creation
      for (const item of sanitizedItems) {
        const prod = await Product.findOne({ id: item.product.id });
        if (prod) {
          prod.stockCount = Math.max(0, (prod.stockCount ?? 10) - item.qty);
          if (prod.stockCount === 0) {
            prod.inStock = false;
          }
          await prod.save();
        }
      }
    }

    console.log(`[Order Created in MongoDB Atlas] ID: ${orderId}, User: ${req.user.id}, Total: ₹${serverTotal}`);
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("[Create Order Error]", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Customer Order History API (Requires Auth, Admins see all, Users see only their own)
app.get("/api/orders/my-orders", protect, async (req, res) => {
  try {
    let mongoQuery = {};

    if (req.user.role === "admin") {
      // Admins see all orders
      mongoQuery = {};
    } else {
      // Regular users see only their own orders (matched by userId or delivery email)
      mongoQuery = {
        $or: [{ userId: req.user.id }, { "deliveryAddress.email": safeLower(req.user.email) }],
      };
    }

    let orders = [];
    if (mongoose.connection.readyState === 1) {
      orders = await Order.find(mongoQuery).sort({ createdAt: -1 }).lean();
    }

    res.json({ orders, count: orders.length });
  } catch (err) {
    console.error("[Get Customer Orders Error]", err);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

// Orders API (Get Order Details with RBAC ownership check)
app.get("/api/orders/:id", protect, async (req, res) => {
  try {
    let order = null;
    if (mongoose.connection.readyState === 1) {
      order = await Order.findOne({ id: req.params.id }).lean();
    }
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // RBAC ownership check
    if (req.user.role !== "admin" && order.userId !== req.user.id && safeLower(order.deliveryAddress?.email) !== safeLower(req.user.email)) {
      return res.status(403).json({ error: "Access denied. You can only view your own orders." });
    }

    res.json(order);
  } catch (err) {
    console.error("[Get Order Error]", err);
    res.status(500).json({ error: "Error fetching order details" });
  }
});

// Submit Product Review API
app.post("/api/products/:id/reviews", async (req, res) => {
  try {
    const productId = req.params.id;
    const { rating, title, comment, userName, userEmail, orderId } = req.body || {};

    const numRating = Number(rating);
    const cleanTitle = safeStr(title);
    const cleanComment = safeStr(comment);
    const cleanName = safeStr(userName) || "Verified Buyer";
    const cleanEmail = safeLower(userEmail);

    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5 stars" });
    }
    if (!cleanTitle || !cleanComment) {
      return res.status(400).json({ error: "Review title and comment are required" });
    }

    const reviewData = {
      id: `rev-${Date.now()}`,
      productId,
      orderId: safeStr(orderId),
      userName: cleanName,
      userEmail: cleanEmail,
      rating: numRating,
      title: cleanTitle,
      comment: cleanComment,
      verifiedPurchase: true,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    let newReview = reviewData;
    if (mongoose.connection.readyState === 1) {
      newReview = await Review.create(reviewData);
    }

    reviewsListMemory.unshift(newReview);

    console.log(`[Review Submitted] Product: ${productId}, Rating: ${numRating}★ by ${cleanName} (Pending Approval)`);
    res.status(201).json({ success: true, review: newReview, message: "Thank you for reviewing! Your review has been submitted for approval." });
  } catch (err) {
    console.error("[Submit Review Error]", err);
    res.status(500).json({ error: "Failed to submit product review" });
  }
});

// Fetch All Customer Reviews (Admin Dashboard)
app.get("/api/reviews", protect, admin, async (req, res) => {
  try {
    let reviews = [];
    if (mongoose.connection.readyState === 1) {
      reviews = await Review.find().sort({ createdAt: -1 }).lean();
      if (reviews.length === 0 && reviewsListMemory.length > 0) {
        reviews = reviewsListMemory;
      }
    } else {
      reviews = reviewsListMemory;
    }
    res.json({ success: true, reviews, count: reviews.length });
  } catch (err) {
    console.error("[Get Reviews Error]", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Fetch Approved Reviews for a Specific Product (Public View)
app.get("/api/products/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const showAll = req.query.all === "true";
    let reviews = [];
    if (mongoose.connection.readyState === 1) {
      const filter = showAll ? { productId: id } : { productId: id, status: "approved" };
      reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
      if (reviews.length === 0 && !showAll) {
        reviews = reviewsListMemory.filter((r) => r.productId === id && (r.status === "approved" || !r.status));
      }
    } else {
      reviews = reviewsListMemory.filter((r) => r.productId === id && (showAll || r.status === "approved" || !r.status));
    }
    res.json({ success: true, reviews, count: reviews.length });
  } catch (err) {
    console.error("[Get Product Reviews Error]", err);
    res.status(500).json({ error: "Failed to fetch product reviews" });
  }
});

// Accept / Approve or Update Review Status (Admin Portal)
app.patch("/api/reviews/:id/status", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    const newStatus = status === "approved" ? "approved" : "pending";

    let targetProductId = null;

    if (mongoose.connection.readyState === 1) {
      let rev = await Review.findOneAndUpdate({ id }, { status: newStatus }, { new: true });
      if (!rev) {
        rev = await Review.findByIdAndUpdate(id, { status: newStatus }, { new: true });
      }
      if (rev) {
        targetProductId = rev.productId;
      }
    }

    const memRev = reviewsListMemory.find((r) => r.id === id || String(r._id) === id);
    if (memRev) {
      memRev.status = newStatus;
      targetProductId = targetProductId || memRev.productId;
    }

    // Recalculate average rating & review count for approved reviews
    if (targetProductId && mongoose.connection.readyState === 1) {
      const approvedReviews = await Review.find({ productId: targetProductId, status: "approved" }).lean();
      const reviewCount = approvedReviews.length;
      const totalSum = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = reviewCount > 0 ? Number((totalSum / reviewCount).toFixed(1)) : 5.0;

      await Product.findOneAndUpdate({ id: targetProductId }, { rating: avgRating, reviewCount });
    }

    console.log(`[Review Status Updated] Review ${id} -> ${newStatus}`);
    res.json({ success: true, message: `Review status updated to ${newStatus}` });
  } catch (err) {
    console.error("[Update Review Status Error]", err);
    res.status(500).json({ error: "Failed to update review status" });
  }
});

// Delete Review (Admin Portal)
app.delete("/api/reviews/:id", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const deleted = await Review.findOneAndDelete({ id });
      if (!deleted) {
        await Review.findByIdAndDelete(id).catch(() => null);
      }
    }
    reviewsListMemory = reviewsListMemory.filter((r) => r.id !== id && String(r._id) !== id);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error("[Delete Review Error]", err);
    res.status(500).json({ error: "Failed to delete review" });
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

// Process-level crash prevention guards for high multi-user concurrency
process.on("uncaughtException", (err) => {
  console.error("⚠️ [Server Crash Guard] Uncaught Exception caught:", err?.message || err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ [Server Crash Guard] Unhandled Rejection at:", promise, "reason:", reason);
});
