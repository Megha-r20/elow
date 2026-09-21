import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { logger } from "./logger.js";

/**
 * Non-destructively creates or updates the admin account using environment variables.
 * In production, ADMIN_EMAIL and ADMIN_PASSWORD environment variables determine the admin credentials.
 */
export const ensureAdminUser = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@elow.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (process.env.NODE_ENV === "production" && !adminPassword) {
    logger.warn("⚠️ ADMIN_PASSWORD environment variable is not set in production. Skipping automatic admin provisioning.");
    return;
  }

  const passwordToUse = adminPassword || "AdminSecret123!";
  const adminName = process.env.ADMIN_NAME || "Elow Admin";

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(passwordToUse, 10);
      await User.create({
        id: `user-admin-${crypto.randomBytes(4).toString("hex")}`,
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      logger.info(`[Admin Provisioned] Created admin account for ${adminEmail}`);
    } else {
      let needsSave = false;
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        needsSave = true;
      }
      if (adminPassword) {
        const isMatch = await bcrypt.compare(adminPassword, existingAdmin.password).catch(() => false);
        if (!isMatch) {
          existingAdmin.password = await bcrypt.hash(adminPassword, 10);
          needsSave = true;
        }
      }
      if (needsSave) {
        await existingAdmin.save();
        logger.info(`[Admin Provisioned] Updated admin account credentials/role for ${adminEmail}`);
      }
    }
  } catch (err) {
    logger.error(`❌ Error ensuring admin user: ${err.message}`);
  }
};
