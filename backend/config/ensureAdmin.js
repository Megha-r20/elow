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

    const existingAdmin = await User.findOne({ email: adminEmail });
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    if (!existingAdmin) {
      await User.create({
        id: `user-admin-${crypto.randomBytes(4).toString("hex")}`,
        name: process.env.ADMIN_NAME || "Elow Admin",
        email: adminEmail,
        password: hashedAdminPassword,
        role: "admin",
      });
      logger.info(`✨ Auto-seeded default admin account (${adminEmail})`);
    } else {
      existingAdmin.role = "admin";
      existingAdmin.password = hashedAdminPassword;
      await existingAdmin.save();
      logger.info(`✨ Updated default admin account credentials & role (${adminEmail})`);
    }

    const demoEmail = "ritika@example.com";
    const existingCustomer = await User.findOne({ email: demoEmail });
    const hashedCustPassword = await bcrypt.hash("password123", 10);

    if (!existingCustomer) {
      await User.create({
        id: `user-cust-${crypto.randomBytes(4).toString("hex")}`,
        name: "Ritika Sharma",
        email: demoEmail,
        password: hashedCustPassword,
        role: "user",
      });
      logger.info(`✨ Auto-seeded default customer account (${demoEmail})`);
    } else {
      existingCustomer.password = hashedCustPassword;
      await existingCustomer.save();
    }
  } catch (err) {
    logger.error(`[Ensure Demo Users Error] ${err.message}`);
  }
};
