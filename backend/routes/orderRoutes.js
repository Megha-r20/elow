import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteAllOrders,
  deleteSingleOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/orders", protect, createOrder);
router.get("/orders/my-orders", protect, getMyOrders);
router.get("/orders/:id", protect, getOrderById);

// Admin routes
router.get("/admin/orders", protect, admin, getAllOrders);
router.patch("/admin/orders/:id/status", protect, admin, updateOrderStatus);
router.delete("/admin/orders", protect, admin, deleteAllOrders);
router.delete("/admin/orders/:id", protect, admin, deleteSingleOrder);

export default router;
