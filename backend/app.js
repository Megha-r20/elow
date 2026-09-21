import "dotenv/config";
import express from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { mongoSanitizeMiddleware } from "./middleware/mongoSanitize.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// Trust reverse proxy (Render / Cloudflare) to extract true client IP for rate limiting
app.set("trust proxy", 1);

// Security headers with Helmet
app.use(helmet({ crossOriginResourcePolicy: false }));

// Dynamic CORS configuration allowing ONLY exact allowed origins from FRONTEND_URL or defaults
const defaultAllowedOrigins = [
  "https://elow-store.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim().replace(/\/$/, "")).filter(Boolean)
  : defaultAllowedOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.trim().replace(/\/$/, "");
      const isAllowed = allowedOrigins.includes(cleanOrigin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Payload size limit & NoSQL input sanitization
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitizeMiddleware);

// Global API Rate Limiter
app.use("/api", globalLimiter);

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

export default app;
