import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { logger } from "./logger.js";

/**
 * Ensures default administrator and demo customer accounts exist and have correct credentials in MongoDB.
 */
export const ensureAdminUser = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@elow.com").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminSecret123!";
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $setOnInsert: { _id: crypto.randomUUID(), name: process.env.ADMIN_NAME || "Elow Admin" },
        $set: { role: "admin", password: hashedAdminPassword },
      },
      { upsert: true, returnDocument: "after" }
    );
    logger.info(`✨ Ensured default admin account (${adminEmail})`);

    const demoEmail = "ritika@example.com";
    const hashedCustPassword = await bcrypt.hash("password123", 10);

    await User.findOneAndUpdate(
      { email: demoEmail },
      {
        $setOnInsert: { _id: crypto.randomUUID(), name: "Ritika Sharma", role: "user" },
        $set: { password: hashedCustPassword },
      },
      { upsert: true, returnDocument: "after" }
    );
    logger.info(`✨ Ensured default customer account (${demoEmail})`);
  } catch (err) {
    logger.error(`[Ensure Demo Users Error] ${err.message}`);
  }
};
