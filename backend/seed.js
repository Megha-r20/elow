import dotenv from "dotenv";
import mongoose from "mongoose";
import { PRODUCTS } from "./data/products.js";
import { Product } from "./models/Product.js";
import { Order } from "./models/Order.js";
import { User } from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const initialUsers = [
  {
    id: "user-admin-1",
    name: "Elow Admin",
    email: "admin@elow.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "user-admin-2",
    name: "Elow Admin IN",
    email: "admin@elow.in",
    password: "admin123",
    role: "admin",
  },
  {
    id: "user-cust-1",
    name: "Ritika Sharma",
    email: "ritika@example.com",
    password: "password123",
    role: "user",
  },
  {
    id: "user-cust-2",
    name: "Elow Customer",
    email: "user@elow.com",
    password: "user123",
    role: "user",
  },
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

    console.log("🧹 Clearing old data (including old demo orders)...");
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    console.log(`🌱 Inserting ${PRODUCTS.length} products into database 'elow' -> collection 'products'...`);
    await Product.insertMany(PRODUCTS);

    console.log("👤 Inserting default user accounts into collection 'users'...");
    await User.insertMany(initialUsers);

    console.log("✨ SUCCESS! All 150 products and user accounts are now stored in MongoDB Atlas! (Orders reset to 0)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err.message);
    console.error("\n💡 SOLUTION: Make sure your IP address is whitelisted in MongoDB Atlas under 'Network Access' -> 'Add IP Address' -> 'Allow Access from Anywhere (0.0.0.0/0)'");
    process.exit(1);
  }
}

seedData();
