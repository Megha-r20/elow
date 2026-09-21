import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { logger } from "../config/logger.js";

dotenv.config();

/**
 * Explicit standalone CLI script to provision or update admin account credentials.
 * Usage:
 *   ADMIN_EMAIL=admin@elow.com ADMIN_PASSWORD=YourStrongPasswordHere node backend/scripts/setupAdmin.js
 */
const setupAdmin = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    logger.error("❌ MONGODB_URI environment variable is required.");
    process.exit(1);
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@elow.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    logger.error("❌ ADMIN_PASSWORD environment variable is required to run setupAdmin.");
    console.error("Usage: ADMIN_EMAIL=admin@elow.com ADMIN_PASSWORD='StrongPassword123!' npm run setup-admin");
    process.exit(1);
  }

  const adminName = process.env.ADMIN_NAME || "Elow Admin";

  try {
    logger.info("📡 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);

    const existingAdmin = await User.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (!existingAdmin) {
      await User.create({
        id: `user-admin-${crypto.randomBytes(4).toString("hex")}`,
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      logger.info(`✨ Successfully created administrator account for ${adminEmail}`);
    } else {
      existingAdmin.name = adminName;
      existingAdmin.role = "admin";
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      logger.info(`✨ Successfully updated administrator account and password for ${adminEmail}`);
    }

    process.exit(0);
  } catch (err) {
    logger.error(`❌ Setup Admin Error: ${err.message}`);
    process.exit(1);
  }
};

setupAdmin();
