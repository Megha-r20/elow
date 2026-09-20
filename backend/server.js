import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import { logger } from "./config/logger.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();
const PORT = process.env.PORT || 5005;

// Security headers with Helmet
app.use(helmet({ crossOriginResourcePolicy: false }));

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

// Root API Welcome Endpoint
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "online",
    name: "Elow Backend REST API",
    database: dbStatus,
    message: "🌸 Elow backend service is running smoothly on Render!",
  });
});

// Health Check API
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    service: "elow-backend",
    environment: process.env.NODE_ENV || "development",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routers
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", reviewRoutes);
app.use("/api", paymentRoutes);

// Single centralized Error Middleware
app.use(notFound);
app.use(errorHandler);

// Graceful termination handling for Render containers
const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info(`🚀 Elow Backend Express API running on http://0.0.0.0:${PORT}`);
});

const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down server gracefully...`);
  server.close(async () => {
    logger.info("HTTP server closed.");
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed.");
    }
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Process-level crash prevention guards
process.on("uncaughtException", (err) => {
  logger.error("⚠️ [Server Crash Guard] Uncaught Exception caught:", err?.message || err);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("⚠️ [Server Crash Guard] Unhandled Rejection at:", promise, "reason:", reason);
});
