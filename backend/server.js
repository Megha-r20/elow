import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { logger } from "./config/logger.js";

// Connect to MongoDB Atlas
connectDB();

const PORT = process.env.PORT || 5005;

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

process.on("uncaughtException", (err) => {
  logger.error("⚠️ [Uncaught Exception] Exiting process:", err?.stack || err?.message || err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, _promise) => {
  logger.error("⚠️ [Unhandled Rejection] Exiting process:", reason);
  process.exit(1);
});
