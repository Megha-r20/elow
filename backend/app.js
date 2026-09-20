import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoose from "mongoose";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

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

export default app;
