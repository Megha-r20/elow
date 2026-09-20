import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { PRODUCTS } from "./data/products.js";
import { Product } from "./models/Product.js";
import { Order } from "./models/Order.js";
import { User } from "./models/User.js";
import { PromoCode } from "./models/PromoCode.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const initialUsers = [
  {
    id: "user-admin-1",
    name: "Elow Admin",
    email: "admin@elow.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: "user-admin-2",
    name: "Elow Admin IN",
    email: "admin@elow.in",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: "user-cust-1",
    name: "Ritika Sharma",
    email: "ritika@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user",
  },
  {
    id: "user-cust-2",
    name: "Elow Customer",
    email: "user@elow.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
  },
];

const initialPromoCodes = [
  { code: "WRITE50", discountType: "fixed", discountValue: 50, minOrderAmount: 0, isActive: true },
  { code: "ELOW10", discountType: "percentage", discountValue: 10, minOrderAmount: 0, isActive: true },
  { code: "SPIN50", discountType: "fixed", discountValue: 50, minOrderAmount: 0, isActive: true },
  { code: "SPIN100", discountType: "fixed", discountValue: 100, minOrderAmount: 0, isActive: true },
  { code: "SPIN150", discountType: "fixed", discountValue: 150, minOrderAmount: 0, isActive: true },
  { code: "SPIN250", discountType: "fixed", discountValue: 250, minOrderAmount: 0, isActive: true },
  { code: "SPIN10", discountType: "fixed", discountValue: 10, minOrderAmount: 0, isActive: true },
];

async function seedData() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set in backend/.env file");
    process.exit(1);
  }

  try {
    console.log("📡 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("🟢 Connected successfully to MongoDB Atlas!");

    console.log("🧹 Clearing old data...");
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await PromoCode.deleteMany({});

    console.log(`🌱 Inserting ${PRODUCTS.length} products into collection 'products'...`);
    await Product.insertMany(PRODUCTS);

    console.log("👤 Inserting default user accounts into collection 'users'...");
    await User.insertMany(initialUsers);

    console.log("🎟️ Inserting promo codes into collection 'promocodes'...");
    await PromoCode.insertMany(initialPromoCodes);

    console.log("✨ SUCCESS! Catalog, users, and promo codes are now stored in MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err.message);
    console.error("\n💡 SOLUTION: Make sure your IP address is whitelisted in MongoDB Atlas under 'Network Access' -> 'Add IP Address' -> 'Allow Access from Anywhere (0.0.0.0/0)'");
    process.exit(1);
  }
}

seedData();
