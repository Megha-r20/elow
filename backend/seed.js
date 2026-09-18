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
    id: "user-cust-1",
    name: "Ritika Sharma",
    email: "ritika@example.com",
    password: "user123",
    role: "user",
  },
];

const initialDemoOrder = {
  id: "US-2026-DEMO01",
  items: [
    {
      product: {
        id: "journal-01",
        name: "Linen Hardcover Bullet Journal 160GSM",
        price: 1299,
        category: "journals",
        subcategory: "Hardcover",
        images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"],
      },
      qty: 1,
    },
  ],
  deliveryAddress: {
    firstName: "Ritika",
    lastName: "Sharma",
    email: "ritika@example.com",
    phone: "9876543210",
    address: "Flat 4B, Orchid Heights, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
  },
  payMethod: "upi",
  subtotal: 1299,
  discount: 0,
  shipping: 0,
  giftCost: 0,
  total: 1299,
  status: "Processing",
  date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
};

async function seedData() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set in backend/.env file");
    process.exit(1);
  }

  try {
    console.log("📡 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("🟢 Connected successfully to MongoDB Atlas!");

    console.log("🧹 Clearing old data (if any)...");
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    console.log(`🌱 Inserting ${PRODUCTS.length} products into database 'elow' -> collection 'products'...`);
    await Product.insertMany(PRODUCTS);

    console.log("👤 Inserting default user accounts into collection 'users'...");
    await User.insertMany(initialUsers);

    console.log("📦 Inserting initial demo order into collection 'orders'...");
    await Order.create(initialDemoOrder);

    console.log("✨ SUCCESS! All 150 products, user accounts, and orders are now stored in MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err.message);
    console.error("\n💡 SOLUTION: Make sure your IP address is whitelisted in MongoDB Atlas under 'Network Access' -> 'Add IP Address' -> 'Allow Access from Anywhere (0.0.0.0/0)'");
    process.exit(1);
  }
}

seedData();
