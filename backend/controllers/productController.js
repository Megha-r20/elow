import crypto from "crypto";
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

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Get product catalog with filters and search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const { cat, q, filter, priceRange, inStock, sort } = req.query;

  const mongoQuery = {};

  // Category filter
  if (cat && cat !== "all") {
    mongoQuery.category = cat;
  }

  // Search query (safely escape regex characters to prevent ReDoS and invalid pattern 500 errors)
  if (q && typeof q === "string" && q.trim()) {
    const cleanQ = q.trim();
    const safeRegex = new RegExp(escapeRegExp(cleanQ), "i");
    mongoQuery.$or = [
      { name: safeRegex },
      { shortName: safeRegex },
      { description: safeRegex },
      { category: safeRegex },
      { subcategory: safeRegex },
      { tags: safeRegex },
    ];
  }

  // Special Filter flags
  if (filter === "new") mongoQuery.isNew = true;
  if (filter === "bestseller") mongoQuery.isBestseller = true;
  if (inStock === "true") mongoQuery.inStock = true;

  // Price range filter
  if (priceRange !== undefined && priceRange !== null && priceRange !== "") {
    const idx = parseInt(String(priceRange), 10);
    if (!isNaN(idx) && PRICE_RANGES && PRICE_RANGES[idx]) {
      const r = PRICE_RANGES[idx];
      mongoQuery.price = { $gte: r.min, $lte: r.max };
    }
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  switch (sort) {
    case "price-asc":
      sortOption = { price: 1 };
      break;
    case "price-desc":
      sortOption = { price: -1 };
      break;
    case "rating":
      sortOption = { rating: -1, reviewCount: -1 };
      break;
    case "newest":
      sortOption = { isNew: -1, createdAt: -1 };
      break;
    case "bestselling":
      sortOption = { isBestseller: -1, createdAt: -1 };
      break;
  }

  // Pagination (default page size: 20, max limit capped at 200)
  const total = await Product.countDocuments(mongoQuery);
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const rawLimit = req.query.limit;

  const MAX_LIMIT = 200;
  let limit = 20;

  if (rawLimit === "all" || rawLimit === "0") {
    limit = MAX_LIMIT;
  } else if (rawLimit !== undefined && !isNaN(parseInt(rawLimit, 10))) {
    const parsed = parseInt(rawLimit, 10);
    if (parsed > 0) {
      limit = Math.min(parsed, MAX_LIMIT);
    }
  }

  let productsQuery = Product.find(mongoQuery).sort(sortOption);

  let totalPages = 1;
  let skip = 0;

  if (limit > 0) {
    skip = (page - 1) * limit;
    productsQuery = productsQuery.skip(skip).limit(limit);
    totalPages = Math.ceil(total / limit) || 1;
  }

  const products = await productsQuery.lean();

  res.json({
    products,
    count: products.length,
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
  const { name, category, subcategory, price, originalPrice, description, images, inStock, stockCount, isNew, isBestseller } =
    req.body || {};

  const cleanName = safeStr(name);
  const cleanCategory = safeStr(category);
  const numPrice = Number(price);

  if (!cleanName || !cleanCategory || isNaN(numPrice) || numPrice <= 0) {
    return res.status(400).json({ error: "Valid name, category, and price are required" });
  }

  const parsedStock =
    stockCount !== undefined && stockCount !== "" && !isNaN(Number(stockCount))
      ? Math.max(0, parseInt(stockCount, 10))
      : 10;
  const computedInStock = inStock !== undefined ? Boolean(inStock) : parsedStock > 0;

  const newProduct = await Product.create({
    id: `prod-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
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
    inStock: computedInStock,
    stockCount: parsedStock,
    rating: 0,
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
  const { name, category, subcategory, price, originalPrice, description, images, inStock, stockCount, isNew, isBestseller } =
    req.body || {};

  const cleanName = safeStr(name);
  const cleanCategory = safeStr(category);
  const numPrice = Number(price);

  if (!cleanName || !cleanCategory || isNaN(numPrice) || numPrice <= 0) {
    return res.status(400).json({ error: "Valid name, category, and price are required" });
  }

  const hasStockCount = stockCount !== undefined && stockCount !== "" && !isNaN(Number(stockCount));
  const parsedStock = hasStockCount ? Math.max(0, parseInt(stockCount, 10)) : undefined;

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
    inStock: inStock !== undefined ? Boolean(inStock) : (hasStockCount ? parsedStock > 0 : true),
    ...(hasStockCount ? { stockCount: parsedStock } : {}),
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
