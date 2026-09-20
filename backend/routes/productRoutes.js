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
import { validate } from "../middleware/validationMiddleware.js";
import { createProductSchema, updateProductSchema } from "../middleware/schemas.js";

const router = express.Router();

// Public routes
router.get("/categories", getCategories);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// Admin routes
router.post("/admin/products", protect, admin, validate(createProductSchema), createProduct);
router.put("/admin/products/:id", protect, admin, validate(updateProductSchema), updateProduct);
router.delete("/admin/products/:id", protect, admin, deleteProduct);

export default router;
