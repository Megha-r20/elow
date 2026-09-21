import express from "express";
import { getCustomers, updateCustomerRole, getAnalytics } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin/users", protect, admin, getCustomers);
router.patch("/admin/users/:id/role", protect, admin, updateCustomerRole);
router.get("/admin/analytics", protect, admin, getAnalytics);

export default router;
