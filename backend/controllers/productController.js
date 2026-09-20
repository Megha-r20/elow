import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { CATEGORIES, PRICE_RANGES } from "../data/products.js";
import { logger } from "../config/logger.js";

const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());
const safeLower = (v) => safeStr(v).toLowerCase();

// @desc    Get categories
// @route   GET /api/categories
// @access  Public
export const getCategories = (req, res) => {
  res.json(CATEGORIES || []);
};

// @desc    Get product catalog with filters and search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const { cat, q, filter, priceRange, inStock, sort } = req.query;

  let products = await Product.find({}).lean();
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

  const total = list.length;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limitParam = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : null;

  let paginatedProducts = list;
  let totalPages = 1;

  if (limitParam && limitParam > 0) {
    const limit = limitParam;
    const skip = (page - 1) * limit;
    paginatedProducts = list.slice(skip, skip + limit);
    totalPages = Math.ceil(total / limit) || 1;
  }

  res.json({
    products: paginatedProducts,
    count: paginatedProducts.length,
    total,
    page,
    totalPages,
  });
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  const prodId = req.params.id;
  const product = await Product.findOne({ id: prodId }).lean();

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const related = await Product.find({ category: product.category, id: { $ne: product.id } })
    .limit(4)
    .lean();

  const reviews = await Review.find({ productId: product.id, status: "approved" }).sort({ createdAt: -1 }).lean();

  res.json({ product, reviews, related });
};

// @desc    Create new product (Admin)
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { name, category, subcategory, price, originalPrice, description, images, inStock, isNew, isBestseller } =
    req.body || {};

  const cleanName = safeStr(name);
  const cleanCategory = safeStr(category);
  const numPrice = Number(price);

  if (!cleanName || !cleanCategory || isNaN(numPrice) || numPrice <= 0) {
    return res.status(400).json({ error: "Valid name, category, and price are required" });
  }

  const newProduct = await Product.create({
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
  });

  logger.info(`[Admin Created Product] ${newProduct.name} (${newProduct.id})`);
  res.status(201).json({ success: true, product: newProduct });
};

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
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

  const updatedProduct = await Product.findOneAndUpdate({ id: prodId }, updateFields, { new: true }).lean();
  if (!updatedProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  logger.info(`[Admin Updated Product] ${updatedProduct.name} (${updatedProduct.id})`);
  res.json({ success: true, product: updatedProduct });
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const prodId = req.params.id;
  const deleted = await Product.findOneAndDelete({ id: prodId });

  if (!deleted) {
    return res.status(404).json({ error: "Product not found" });
  }

  logger.info(`[Admin Deleted Product] ID: ${prodId}`);
  res.json({ success: true, message: "Product deleted successfully" });
};
