import crypto from "crypto";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { Category } from "../models/Category.js";
import { PRODUCTS as DEFAULT_PRODUCTS, CATEGORIES as DEFAULT_CATEGORIES, PRICE_RANGES } from "../data/products.js";
import { logger } from "../config/logger.js";
import { resolvePinterestUrl } from "../utils/pinterestResolver.js";

const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());

// Helper function to seed initial categories or sync/purge legacy categories in MongoDB
const seedCategoriesIfNeeded = async () => {
  if (DEFAULT_CATEGORIES && DEFAULT_CATEGORIES.length > 0) {
    const dbCount = await Category.countDocuments();
    if (dbCount !== DEFAULT_CATEGORIES.length) {
      logger.info(`[Auto Sync] Resetting MongoDB Atlas categories collection to exact ${DEFAULT_CATEGORIES.length} items...`);
      await Category.deleteMany({});
      const docs = DEFAULT_CATEGORIES.map((c) => ({
        id: c.id,
        name: c.label || c.name || c.id,
        slug: (c.id || "").toLowerCase(),
        description: c.desc || c.description || "",
        image: c.image || c.imageUrl || "",
        productCount: c.productCount ?? c.count ?? 0,
        isActive: true,
      }));
      await Category.insertMany(docs);
    } else {
      for (const c of DEFAULT_CATEGORIES) {
        await Category.updateOne(
          { id: c.id },
          {
            $set: {
              name: c.label || c.name || c.id,
              slug: (c.id || "").toLowerCase(),
              description: c.desc || c.description || "",
              image: c.image || c.imageUrl || "",
              productCount: c.productCount ?? c.count ?? 0,
              isActive: true,
            },
          }
        );
      }
    }
  }
};

// Helper function to seed initial products or sync/purge legacy products in MongoDB
const seedProductsIfNeeded = async () => {
  if (DEFAULT_PRODUCTS && DEFAULT_PRODUCTS.length > 0) {
    const dbCount = await Product.countDocuments();
    if (dbCount !== DEFAULT_PRODUCTS.length) {
      logger.info(`[Auto Sync] Resetting MongoDB Atlas products collection to exact ${DEFAULT_PRODUCTS.length} catalog items...`);
      await Product.deleteMany({});
      await Product.insertMany(DEFAULT_PRODUCTS);
    }
  }
};

// @desc    Get categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    await seedCategoriesIfNeeded();
    await seedProductsIfNeeded();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();

    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(item => {
      if (item._id) {
        countMap[item._id.toLowerCase()] = item.count;
      }
    });

    const formatted = categories.map((c) => {
      const matchId = (c.id || c.slug || "").toLowerCase();
      const defaultCat = (DEFAULT_CATEGORIES || []).find(d => (d.id || "").toLowerCase() === matchId) || {};
      const dbCount = countMap[matchId];
      const calculatedCount = (dbCount !== undefined && dbCount >= 0) ? dbCount : (defaultCat.productCount ?? 0);
      return {
        id: c.id,
        label: c.name,
        name: c.name,
        slug: c.slug,
        desc: c.description,
        description: c.description,
        image: defaultCat.image || c.image,
        count: calculatedCount,
        productCount: calculatedCount,
        isActive: c.isActive,
      };
    });
    res.json(formatted);
  } catch (_err) {
    res.json(DEFAULT_CATEGORIES || []);
  }
};

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Get product catalog with filters and search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    await seedProductsIfNeeded();
  } catch (_e) {
    /* ignore auto-seed error if DB connection has issues */
  }
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

  let rawImages = Array.isArray(images) && images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"];
  const resolvedImages = await Promise.all(rawImages.map((img) => resolvePinterestUrl(img)));

  const newProduct = await Product.create({
    id: `prod-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    name: cleanName,
    shortName: cleanName,
    category: cleanCategory,
    subcategory: safeStr(subcategory) || "General",
    price: numPrice,
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    description: safeStr(description) || "Handcrafted aesthetic lifestyle product.",
    images: resolvedImages,
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

  let resolvedImages;
  if (Array.isArray(images) && images.length > 0) {
    resolvedImages = await Promise.all(images.map((img) => resolvePinterestUrl(img)));
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
    ...(resolvedImages ? { images: resolvedImages } : {}),
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

// @desc    Get all categories for admin (including inactive)
// @route   GET /api/admin/categories
// @access  Private/Admin
export const getAllCategoriesAdmin = async (req, res) => {
  await seedCategoriesIfNeeded();
  const categories = await Category.find().sort({ createdAt: -1 }).lean();
  res.json(categories);
};

// @desc    Create category (Admin)
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  const { name, slug, description, image } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const cleanName = name.trim();
  const catSlug = (slug || cleanName).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const catId = catSlug || `cat-${Date.now()}`;

  const existing = await Category.findOne({ $or: [{ id: catId }, { slug: catSlug }] });
  if (existing) {
    return res.status(400).json({ error: "Category with this name or slug already exists" });
  }

  const resolvedImage = image ? await resolvePinterestUrl(safeStr(image)) : "";

  const newCat = await Category.create({
    id: catId,
    name: cleanName,
    slug: catSlug,
    description: safeStr(description),
    image: resolvedImage,
    isActive: true,
  });

  logger.info(`[Admin Created Category] ${newCat.name} (${newCat.id})`);
  res.status(201).json({ success: true, category: newCat });
};

// @desc    Update category (Admin)
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  const catId = req.params.id;
  const { name, description, image, isActive } = req.body;

  const updateData = {};
  if (name && name.trim()) {
    updateData.name = name.trim();
    updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  if (description !== undefined) updateData.description = safeStr(description);
  if (image !== undefined) updateData.image = await resolvePinterestUrl(safeStr(image));
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  const updated = await Category.findOneAndUpdate({ id: catId }, updateData, { new: true }).lean();
  if (!updated) {
    return res.status(404).json({ error: "Category not found" });
  }

  logger.info(`[Admin Updated Category] ${updated.name} (${catId})`);
  res.json({ success: true, category: updated });
};

// @desc    Delete category (Admin)
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategoryAdmin = async (req, res) => {
  const catId = req.params.id;
  const deleted = await Category.findOneAndDelete({ id: catId });

  if (!deleted) {
    return res.status(404).json({ error: "Category not found" });
  }

  logger.info(`[Admin Deleted Category] ID: ${catId}`);
  res.json({ success: true, message: "Category deleted successfully" });
};

// @desc    Resolve Pinterest/external URL to direct image URL (Admin)
// @route   GET /api/admin/resolve-image
// @access  Private/Admin
export const resolveImageEndpoint = async (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl) {
    return res.status(400).json({ error: "URL query parameter is required" });
  }
  const resolved = await resolvePinterestUrl(rawUrl);
  res.json({ original: rawUrl, resolved });
};

