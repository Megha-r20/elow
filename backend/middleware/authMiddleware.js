import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { logger } from "../config/logger.js";

import crypto from "crypto";

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  logger.warn("⚠️ [SECURITY WARNING] JWT_SECRET environment variable is not set. Generated a temporary random 256-bit secret key for runtime security.");
  jwtSecret = crypto.randomBytes(32).toString("hex");
}
export const JWT_SECRET = jwtSecret;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || `${JWT_SECRET}_refresh`;

// Short-lived Access Token (15 minutes)
export const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role, type: "access" }, JWT_SECRET, { expiresIn: "15m" });
};

// Long-lived Refresh Token (7 days)
export const generateRefreshToken = (userId, role) => {
  return jwt.sign({ id: userId, role, type: "refresh" }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const generateToken = (userId, role) => {
  return generateAccessToken(userId, role);
};

// Helper to set httpOnly Refresh Token cookie
export const sendRefreshTokenCookie = (res, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper to clear Refresh Token cookie
export const clearRefreshTokenCookie = (res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    expires: new Date(0),
  });
};

// Zero-dependency Cookie Parser helper
export const parseCookies = (req) => {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      if (parts.length >= 2) {
        list[parts.shift().trim()] = decodeURIComponent(parts.join("="));
      }
    });
  }
  return list;
};

export const sanitizeUser = (user) => {
  if (!user) return null;
  const raw = typeof user.toObject === "function" ? user.toObject() : user;
  const safeUser = { ...raw };
  delete safeUser.password;
  delete safeUser._id;
  delete safeUser.__v;
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
