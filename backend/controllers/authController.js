import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
  parseCookies,
  sanitizeUser,
  JWT_REFRESH_SECRET,
} from "../middleware/authMiddleware.js";
import { logger } from "../config/logger.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "mock-google-client-id");

const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());
const safeLower = (v) => safeStr(v).toLowerCase();

// Middleware: CSRF validation for cookie-authenticated endpoints
export const verifyCsrfHeader = (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;
  const host = req.headers.host;

  if (origin) {
    try {
      const originUrl = new URL(origin);
      const allowedOrigins = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const isHostMatch = host && originUrl.host.toLowerCase() === host.toLowerCase();
      const isAllowedOrigin = allowedOrigins.some((ao) => origin.toLowerCase().startsWith(ao));
      const isLocalDev = originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1";

      if (!isHostMatch && !isAllowedOrigin && !isLocalDev) {
        logger.warn(`🛑 CSRF validation failed for ${req.path}: Origin ${origin} not permitted`);
        return res.status(403).json({ error: "CSRF validation failed: Request origin not allowed." });
      }
    } catch (_err) {
      return res.status(403).json({ error: "CSRF validation failed: Invalid Origin or Referer header." });
    }
  }

  next();
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};

  const cleanName = safeStr(name);
  const cleanEmail = safeLower(email);
  const cleanPass = safeStr(password);

  if (!cleanName || !cleanEmail || !cleanPass) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  if (cleanPass.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  const existingUser = await User.findOne({ email: cleanEmail }).lean();
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(cleanPass, 10);
  const userId = crypto.randomUUID();
  const refreshToken = generateRefreshToken(userId, "user");

  const newUser = await User.create({
    _id: userId,
    name: cleanName,
    email: cleanEmail,
    password: hashedPassword,
    role: "user",
    refreshTokens: [refreshToken],
  });

  const accessToken = generateAccessToken(newUser.id, newUser.role);
  sendRefreshTokenCookie(res, refreshToken);

  logger.info(`[User Registered] ${newUser.name} (${newUser.email})`);
  res.status(201).json({ success: true, user: sanitizeUser(newUser), token: accessToken });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  const cleanEmail = safeLower(email);
  const cleanPass = safeStr(password);

  if (!cleanEmail || !cleanPass) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Check if account is currently locked out
  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    const remainingMs = user.lockoutUntil.getTime() - Date.now();
    const remainingMins = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
    logger.warn(`🛑 Blocked login attempt on locked account: ${user.email}`);
    return res.status(429).json({
      error: `Account is temporarily locked due to repeated failed login attempts. Please try again in ${remainingMins} minute(s).`,
    });
  }

  const isPasswordMatch = await bcrypt.compare(cleanPass, user.password).catch(() => false);

  if (!isPasswordMatch) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute lockout
      logger.warn(`🔒 Account locked out after ${user.failedLoginAttempts} failed attempts: ${user.email}`);
    }
    await user.save();
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Reset failed login tracking on successful authentication
  if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push(refreshToken);
  await user.save();

  sendRefreshTokenCookie(res, refreshToken);

  logger.info(`[User Logged In] ${user.name} (${user.email}) - Role: ${user.role}`);
  res.json({ success: true, user: sanitizeUser(user), token: accessToken });
};

// @desc    Refresh short-lived access token using httpOnly refresh cookie (with Token Rotation)
// @route   POST /api/auth/refresh
// @access  Public (strictly via httpOnly cookie)
export const refreshTokenUser = async (req, res) => {
  const cookies = parseCookies(req);
  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token cookie missing or expired" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findOne({ id: decoded.id });

    if (!user || !Array.isArray(user.refreshTokens) || !user.refreshTokens.includes(refreshToken)) {
      // Reuse or invalid token detected: clear cookie and revoke user tokens for security
      if (user) {
        user.refreshTokens = [];
        await user.save();
      }
      clearRefreshTokenCookie(res);
      return res.status(401).json({ error: "Refresh token has been revoked or already used" });
    }

    // Token Rotation: Remove old token, generate and save new token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id, user.role);

    user.refreshTokens.push(newRefreshToken);
    await user.save();

    sendRefreshTokenCookie(res, newRefreshToken);

    res.json({ success: true, user: sanitizeUser(user), token: newAccessToken });
  } catch (err) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};

// @desc    Logout user & revoke refresh token
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  const cookies = parseCookies(req);
  const refreshToken = cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      await User.findOneAndUpdate(
        { id: decoded.id },
        { $pull: { refreshTokens: refreshToken } }
      );
    } catch (err) {
      // Ignore token expiry errors on logout
    }
  }

  clearRefreshTokenCookie(res);
  res.json({ success: true, message: "Logged out successfully" });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @desc    Update user profile & password
// @route   PATCH /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const user = await User.findOne({ id: req.user.id });
  if (!user) {
    return res.status(401).json({ error: "User profile not found" });
  }

  const { name, email, phone, bio, avatar, address, currentPassword, newPassword } = req.body || {};

  if (name) {
    const cleanName = safeStr(name);
    if (cleanName) user.name = cleanName;
  }

  if (email) {
    const cleanEmail = safeLower(email);
    if (cleanEmail && cleanEmail !== safeLower(user.email)) {
      const existing = await User.findOne({ id: { $ne: user.id }, email: cleanEmail }).lean();
      if (existing) {
        return res.status(400).json({ error: "An account with this email already exists" });
      }
      user.email = cleanEmail;
    }
  }

  if (phone !== undefined) user.phone = safeStr(phone);
  if (bio !== undefined) user.bio = safeStr(bio);
  if (avatar !== undefined) user.avatar = safeStr(avatar);
  if (address !== undefined) user.address = safeStr(address);

  if (newPassword) {
    const cleanCurrent = safeStr(currentPassword);
    const cleanNew = safeStr(newPassword);

    if (!cleanCurrent) {
      return res.status(400).json({ error: "Current password is required to set a new password" });
    }

    const isCurrentValid = await bcrypt.compare(cleanCurrent, user.password).catch(() => false);
    if (!isCurrentValid) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    if (cleanNew.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters long" });
    }

    user.password = await bcrypt.hash(cleanNew, 10);
  }

  await user.save();
  logger.info(`[User Updated Profile] ${user.name} (${user.email})`);
  res.json({ success: true, user: sanitizeUser(user), message: "Profile updated successfully" });
};

// @desc    Get current user's wishlist
// @route   GET /api/auth/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ wishlist: user.wishlist || [] });
};

// @desc    Toggle item in user's server-side wishlist
// @route   POST /api/auth/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res) => {
  const { productId } = req.body || {};
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const cleanId = String(productId).trim();
  const list = user.wishlist || [];
  const idx = list.indexOf(cleanId);
  if (idx > -1) {
    list.splice(idx, 1);
  } else {
    list.push(cleanId);
  }
  user.wishlist = list;
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
};

// @desc    Batch sync wishlist (e.g. migrate guest local items on login)
// @route   PUT /api/auth/wishlist
// @access  Private
export const syncWishlist = async (req, res) => {
  const { productIds } = req.body || {};
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (Array.isArray(productIds)) {
    const combined = new Set([...(user.wishlist || []), ...productIds.map(String)]);
    user.wishlist = Array.from(combined);
    await user.save();
  }
  res.json({ success: true, wishlist: user.wishlist || [] });
};

// @desc    Request password reset token
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body || {};
  const cleanEmail = safeLower(email);

  if (!cleanEmail) {
    return res.status(400).json({ error: "Email address is required" });
  }

  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    return res.json({ success: true, message: "If an account with that email exists, password reset instructions have been sent." });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
  await user.save();

  logger.info(`[Password Reset Requested] Email: ${user.email}`);

  sendPasswordResetEmail(user.email, rawToken).catch((err) => {
    logger.error(`[Email Dispatch Error] ${err.message}`);
  });

  res.json({
    success: true,
    message: "If an account with that email exists, password reset instructions have been sent.",
    resetToken: process.env.NODE_ENV !== "production" ? rawToken : undefined,
  });
};

// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body || {};
  const cleanToken = safeStr(token);
  const cleanPass = safeStr(newPassword);

  if (!cleanToken || !cleanPass) {
    return res.status(400).json({ error: "Reset token and new password are required" });
  }

  if (cleanPass.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters long" });
  }

  const tokenHash = crypto.createHash("sha256").update(cleanToken).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ error: "Password reset token is invalid or has expired." });
  }

  user.password = await bcrypt.hash(cleanPass, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshTokens = []; // Revoke all active sessions on password reset
  await user.save();

  logger.info(`[Password Reset Success] User: ${user.email}`);

  res.json({ success: true, message: "Password has been reset successfully. Please log in with your new password." });
};

// @desc    Authenticate or register user with Google OAuth
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  const { idToken, credential, email: bodyEmail, name: bodyName, avatar: bodyAvatar } = req.body || {};
  const tokenToVerify = credential || idToken;

  let verifiedEmail = bodyEmail;
  let verifiedName = bodyName;
  let verifiedAvatar = bodyAvatar;

  if (tokenToVerify) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: tokenToVerify,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (payload) {
        verifiedEmail = payload.email;
        verifiedName = payload.name;
        verifiedAvatar = payload.picture;
      }
    } catch (verifyErr) {
      if (process.env.NODE_ENV === "production" || !bodyEmail) {
        logger.warn(`🛑 Invalid Google ID token verification attempt: ${verifyErr.message}`);
        return res.status(401).json({ error: "Invalid Google authentication token." });
      }
    }
  } else if (process.env.NODE_ENV === "production") {
    return res.status(400).json({ error: "Google ID token or credential is required for OAuth sign-in." });
  }

  const cleanEmail = safeLower(verifiedEmail) || "google.user@example.com";
  const cleanName = safeStr(verifiedName) || "Google Member";

  let user = await User.findOne({ email: cleanEmail });

  // SECURITY: Strictly reject Google Auth for any admin accounts or attempts to authenticate as admin.
  // Admin accounts must authenticate exclusively via email and password credentials.
  if (user && user.role === "admin") {
    logger.warn(`🛑 Blocked Google Auth attempt for admin account: ${cleanEmail}`);
    return res.status(403).json({
      error: "Admin accounts must sign in with email and password credentials.",
    });
  }

  if (!user) {
    const dummyPassword = await bcrypt.hash(`google-pass-${Date.now()}`, 10);
    const userId = crypto.randomUUID();
    user = await User.create({
      _id: userId,
      name: cleanName,
      email: cleanEmail,
      password: dummyPassword,
      role: "user", // All new Google OAuth registrations strictly default to standard "user" role
      avatar: verifiedAvatar || undefined,
    });
    logger.info(`✨ Google OAuth user created: ${cleanName} (${cleanEmail})`);
  }

  // Ensure user role is strictly "user" for Google OAuth authentication
  user.role = "user";

  const accessToken = generateAccessToken(user.id, "user");
  const refreshToken = generateRefreshToken(user.id, "user");

  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push(refreshToken);
  await user.save();

  sendRefreshTokenCookie(res, refreshToken);

  logger.info(`[Google Sign-In Success] ${user.name} (${user.email}) - Role: user`);
  res.json({ success: true, user: sanitizeUser(user), token: accessToken });
};
