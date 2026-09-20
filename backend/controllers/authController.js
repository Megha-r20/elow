import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateToken, sanitizeUser } from "../middleware/authMiddleware.js";
import { logger } from "../config/logger.js";

const safeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());
const safeLower = (v) => safeStr(v).toLowerCase();

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

  if (cleanPass.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  const existingUser = await User.findOne({ email: cleanEmail }).lean();
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(cleanPass, 10);
  const userId = `user-${Date.now()}`;

  const newUser = await User.create({
    id: userId,
    name: cleanName,
    email: cleanEmail,
    password: hashedPassword,
    role: "user",
  });

  const token = generateToken(newUser.id, newUser.role);
  logger.info(`[User Registered] ${newUser.name} (${newUser.email})`);

  res.status(201).json({ success: true, user: sanitizeUser(newUser), token });
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

  const user = await User.findOne({ email: cleanEmail }).lean();
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isPasswordMatch = await bcrypt.compare(cleanPass, user.password).catch(() => false);
  if (!isPasswordMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken(user.id, user.role);
  logger.info(`[User Logged In] ${user.name} (${user.email}) - Role: ${user.role}`);

  res.json({ success: true, user: sanitizeUser(user), token });
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

    if (cleanNew.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    user.password = await bcrypt.hash(cleanNew, 10);
  }

  await user.save();
  logger.info(`[User Updated Profile] ${user.name} (${user.email})`);
  res.json({ success: true, user: sanitizeUser(user), message: "Profile updated successfully" });
};
