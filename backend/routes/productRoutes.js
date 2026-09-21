import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategoryAdmin,
  resolveImageEndpoint,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { createProductSchema, updateProductSchema } from "../middleware/schemas.js";

const router = express.Router();

// Public routes
router.get("/categories", getCategories);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// Admin routes
router.get("/admin/resolve-image", protect, admin, resolveImageEndpoint);
router.get("/admin/categories", protect, admin, getAllCategoriesAdmin);
router.post("/admin/categories", protect, admin, createCategory);
router.put("/admin/categories/:id", protect, admin, updateCategory);
router.delete("/admin/categories/:id", protect, admin, deleteCategoryAdmin);

router.post("/admin/products", protect, admin, validate(createProductSchema), createProduct);
router.put("/admin/products/:id", protect, admin, validate(updateProductSchema), updateProduct);
router.delete("/admin/products/:id", protect, admin, deleteProduct);

export default router;
