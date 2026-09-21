import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { PRODUCTS } from "./data/products.js";
import { Product } from "./models/Product.js";
import { Order } from "./models/Order.js";
import { User } from "./models/User.js";
import { PromoCode } from "./models/PromoCode.js";
import { logger } from "./config/logger.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seedData() {
  // Production Guard: Prevent accidental DB wipe in production
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_SEED_IN_PROD) {
    logger.error("❌ Refusing to run seed script in production environment (NODE_ENV=production).");
    console.error("❌ Database seeding wipes existing users, products, and orders. It is disabled in production. Set ALLOW_SEED_IN_PROD=true if you explicitly intend to wipe and re-seed production data.");
    process.exit(1);
  }

  if (!MONGODB_URI) {
    logger.error("❌ MONGODB_URI is not set in environment file");
    process.exit(1);
  }

  // Admin and initial user configuration from environment variables
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@elow.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminSecret123!";

  const initialUsers = [
    {
      id: `user-admin-${crypto.randomBytes(4).toString("hex")}`,
      name: process.env.ADMIN_NAME || "Elow Admin",
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
      role: "admin",
    },
    {
      id: `user-cust-${crypto.randomBytes(4).toString("hex")}`,
      name: "Ritika Sharma",
      email: "ritika@example.com",
      password: bcrypt.hashSync("password123", 10),
      role: "user",
    },
    {
      id: `user-cust-${crypto.randomBytes(4).toString("hex")}`,
      name: "Elow Customer",
      email: "user@elow.com",
      password: bcrypt.hashSync("user123", 10),
      role: "user",
    },
  ];

  const initialPromoCodes = [
    { code: "WRITE50", discountType: "fixed", discountValue: 50, minOrderAmount: 0, isActive: true },
    { code: "ELOW10", discountType: "percentage", discountValue: 10, minOrderAmount: 0, isActive: true },
  ];

  try {
    logger.info("📡 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    logger.info("🟢 Connected successfully to MongoDB Atlas!");

    logger.info("🧹 Clearing old development data...");
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await PromoCode.deleteMany({});

    logger.info(`🌱 Inserting ${PRODUCTS.length} products into collection 'products'...`);
    await Product.insertMany(PRODUCTS);

    logger.info("👤 Inserting default user accounts into collection 'users'...");
    await User.insertMany(initialUsers);

    logger.info("🎟️ Inserting promo codes into collection 'promocodes'...");
    await PromoCode.insertMany(initialPromoCodes);

    logger.info("✨ SUCCESS! Catalog, users, and promo codes are now stored in MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    logger.error("❌ Seeding Error:", err.message);
    process.exit(1);
  }
}

seedData();
