import mongoose from "mongoose";
import { logger } from "./logger.js";

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    logger.error("❌ MONGODB_URI environment variable is not defined.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });
    logger.info(`🟢 Connected to MongoDB Atlas successfully! Host: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`❌ MongoDB Atlas Connection Error: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  logger.error(`❌ MongoDB Atlas Listener Error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB Atlas Disconnected. Reconnecting...");
});

mongoose.connection.on("reconnected", () => {
  logger.info("🟢 MongoDB Atlas Reconnected!");
});
