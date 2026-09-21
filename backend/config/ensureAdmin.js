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

  const adminPasswordToUse = adminPassword || "AdminSecret123!";
  const adminName = process.env.ADMIN_NAME || "Elow Admin";

  const defaultUsers = [
    {
      email: adminEmail,
      name: adminName,
      password: adminPasswordToUse,
      role: "admin",
      idPrefix: "user-admin",
    },
    {
      email: "ritika@example.com",
      name: "Ritika Sharma",
      password: "password123",
      role: "user",
      idPrefix: "user-cust",
    },
    {
      email: "customer@elow.com",
      name: "Elow Customer",
      password: "password123",
      role: "user",
      idPrefix: "user-cust",
    },
    {
      email: "user@elow.com",
      name: "Elow Customer",
      password: "password123",
      role: "user",
      idPrefix: "user-cust",
    },
  ];

  try {
    for (const u of defaultUsers) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({
          id: `${u.idPrefix}-${crypto.randomBytes(4).toString("hex")}`,
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role,
        });
        logger.info(`[User Provisioned] Created account for ${u.email} (${u.role})`);
      } else {
        let needsSave = false;
        if (u.role === "admin" && existing.role !== "admin") {
          existing.role = "admin";
          needsSave = true;
        }
        const isMatch = await bcrypt.compare(u.password, existing.password).catch(() => false);
        if (!isMatch) {
          existing.password = await bcrypt.hash(u.password, 10);
          needsSave = true;
        }
        if (needsSave) {
          await existing.save();
          logger.info(`[User Provisioned] Updated account credentials/role for ${u.email}`);
        }
      }
    }
  } catch (err) {
    logger.error(`❌ Error ensuring default users: ${err.message}`);
  }
};
