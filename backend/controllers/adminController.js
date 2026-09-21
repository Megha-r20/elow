import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { logger } from "../config/logger.js";

// @desc    Get customer directory for admin
// @route   GET /api/admin/users
// @access  Private/Admin
export const getCustomers = async (req, res) => {
  const { q } = req.query;

  const filter = {};
  if (q && q.trim()) {
    const searchRegex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
  }

  const users = await User.find(filter).select("-password -refreshTokens").sort({ createdAt: -1 }).lean();

  // Calculate order metrics for each customer
  const userStats = await Order.aggregate([
    {
      $group: {
        _id: "$userEmail",
        orderCount: { $sum: 1 },
        totalSpent: { $sum: { $cond: [{ $ne: ["$status", "Cancelled"] }, "$totalAmount", 0] } },
      },
    },
  ]);

  const statsMap = {};
  userStats.forEach((s) => {
    if (s._id) statsMap[s._id.toLowerCase()] = s;
  });

  const enrichedUsers = users.map((u) => {
    const stats = statsMap[(u.email || "").toLowerCase()] || { orderCount: 0, totalSpent: 0 };
    return {
      ...u,
      orderCount: stats.orderCount,
      totalSpent: stats.totalSpent,
    };
  });

  res.json(enrichedUsers);
};

// @desc    Update customer role / details (Admin)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
export const updateCustomerRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  const query = mongoose.Types.ObjectId.isValid(userId) ? { $or: [{ id: userId }, { _id: userId }] } : { id: userId };
  const user = await User.findOneAndUpdate(query, { role }, { new: true })
    .select("-password -refreshTokens")
    .lean();

  if (!user) {
    return res.status(404).json({ error: "Customer not found" });
  }

  logger.info(`[Admin Updated User Role] ${user.email} -> ${role}`);
  res.json({ success: true, user });
};

// @desc    Get admin analytics and chart metrics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  // Revenue computation (excluding cancelled orders)
  const revenueAgg = await Order.aggregate([
    { $match: { status: { $ne: "Cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  // Order status breakdown
  const statusAgg = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const statusMap = { Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
  statusAgg.forEach((item) => {
    if (item._id && statusMap[item._id] !== undefined) {
      statusMap[item._id] = item.count;
    }
  });

  // Sales Trend over time (grouped by date formatted as YYYY-MM-DD)
  const salesTrend = await Order.aggregate([
    { $match: { status: { $ne: "Cancelled" } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 14 },
  ]);

  // Category sales breakdown
  const categorySales = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.category",
        totalQuantity: { $sum: "$items.qty" },
        totalRevenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  res.json({
    summary: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    },
    orderStatuses: statusMap,
    salesTrend: salesTrend.map((t) => ({ date: t._id, revenue: t.revenue, orders: t.orders })),
    categorySales: categorySales.map((c) => ({ category: c._id || "Other", revenue: c.totalRevenue, units: c.totalQuantity })),
  });
};
