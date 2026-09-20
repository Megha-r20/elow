import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/categories", getCategories);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// Admin routes
router.post("/admin/products", protect, admin, createProduct);
router.put("/admin/products/:id", protect, admin, updateProduct);
router.delete("/admin/products/:id", protect, admin, deleteProduct);

export default router;
