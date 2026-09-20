import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { logger } from "../config/logger.js";

import crypto from "crypto";

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  logger.warn("⚠️ [SECURITY WARNING] JWT_SECRET environment variable is not set. Generated a temporary random 256-bit secret key for runtime security.");
  jwtSecret = crypto.randomBytes(32).toString("hex");
}
const JWT_SECRET = jwtSecret;

export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "30d" });
};

export const sanitizeUser = (user) => {
  if (!user) return null;
  const raw = typeof user.toObject === "function" ? user.toObject() : user;
  const { password, _id, __v, ...safeUser } = raw;
  return safeUser;
};

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no session token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.id }).lean();

    if (!user) {
      return res.status(401).json({ error: "User profile not found or expired session" });
    }

    req.user = sanitizeUser(user);
    req.userRaw = user;
    next();
  } catch (err) {
    logger.error(`[JWT Protect Error] ${err.message}`);
    return res.status(401).json({ error: "Not authorized, invalid session token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Administrator privileges required." });
  }
};
