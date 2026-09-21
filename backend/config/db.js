import mongoose from "mongoose";
import { logger } from "./logger.js";
import { ensureAdminUser } from "./ensureAdmin.js";

/**
 * Utility function to redact credentials from MongoDB URIs in log output.
 */
const maskUri = (uri) => {
  if (!uri) return "";
  return uri.replace(/\/\/(.*):(.*)@/, "//***:***@");
};

/**
 * Establishes and manages a production-ready Mongoose connection to MongoDB Atlas.
 * Includes connection pooling, automatic reconnects, heartbeat health checks,
 * and duplicate connection prevention.
 */
export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    logger.error("❌ MONGODB_URI environment variable is not defined in process.env");
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return null;
  }

  // Reuse existing connection if already connected (1) or connecting (2)
  if (mongoose.connection.readyState === 1) {
    logger.info("ℹ️ Reusing existing active MongoDB Atlas connection.");
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    logger.info("ℹ️ MongoDB Atlas connection already in progress...");
    return mongoose.connection;
  }

  // Production-grade Mongoose connection options
  const options = {
    maxPoolSize: Number(process.env.DB_MAX_POOL_SIZE) || 10,
    minPoolSize: Number(process.env.DB_MIN_POOL_SIZE) || 2,
    serverSelectionTimeoutMS: 5000,   // Fail fast after 5s if server selection hangs
    socketTimeoutMS: 45000,           // Close inactive sockets after 45s
    connectTimeoutMS: 10000,          // Initial connection timeout after 10s
    heartbeatFrequencyMS: 10000,      // Check MongoDB cluster node health every 10s
    retryWrites: true,                // Retry write operations on transient errors
    autoIndex: process.env.NODE_ENV !== "production", // Enable autoIndex only in non-production
  };

  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    const host = conn.connection.host || "Atlas Cluster";
    logger.info(`🟢 Connected to MongoDB Atlas successfully! Host: ${host}`);

    // Ensure default admin & demo customer accounts exist
    await ensureAdminUser();

    return conn.connection;
  } catch (err) {
    logger.error(`❌ MongoDB Atlas Connection Failed (${maskUri(MONGODB_URI)}): ${err.message}`);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    throw err;
  }
};

// Global Mongoose Connection Lifecycle Event Listeners
mongoose.connection.on("connected", () => {
  logger.info("🟢 Mongoose lifecycle event: Connected to MongoDB Atlas");
});

mongoose.connection.on("error", (err) => {
  logger.error(`❌ Mongoose connection error event: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ Mongoose disconnected from MongoDB Atlas. Driver will automatically attempt reconnection...");
});

mongoose.connection.on("reconnected", () => {
  logger.info("🟢 Mongoose reconnected to MongoDB Atlas!");
});

mongoose.connection.on("close", () => {
  logger.info("ℹ️ Mongoose connection closed.");
});
