# ☁️ elow — stationery • lifestyle • little joys

[![Live Store](https://img.shields.io/badge/Live_Store-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://elow-store.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://elow.onrender.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **Live Deployment Links:**  
> 🌐 **Frontend Storefront (Vercel):** [https://elow-store.vercel.app/](https://elow-store.vercel.app/)  
> ⚡ **Backend REST API (Render):** [https://elow.onrender.com](https://elow.onrender.com)

---

## 📖 Overview

**elow** is a full-stack e-commerce application for curated stationery, lifestyle items, and desk accessories. Built with a **React 19** storefront and a secure **Node.js / Express / MongoDB Atlas** backend REST API, **elow** provides a seamless shopping experience for customers and a comprehensive management portal for administrators.

Key production features include **Bcrypt password hashing**, **JWT session authentication**, **Role-Based Access Control (RBAC)**, **server-side financial calculations & inventory control**, **Stripe payment status verification**, **Admin review moderation**, **Helmet security headers**, **Express rate limiting**, and **React Error Boundaries**.

---

## 🔑 Demo Credentials

Test the live store or local environment using these pre-seeded accounts:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@elow.com` | `Admin123!` | Full access to `/admin` dashboard, product CRUD, review moderation & order management |
| **Customer** | `customer@elow.com` | `Customer123!` | Storefront browsing, review submission, server-side checkout, order history & account settings (`/settings`) |

---

## ✨ Key Features

### 🛍️ Customer Experience
- **Aesthetic Pinterest Design**: Soft pastel palette, glassmorphism navigation, dynamic responsive layout, and tactile hover animations.
- **Product Search & Filtering**: Real-time category filtering, search queries, price range slider, in-stock toggle, and paginated product catalog (`/api/products`).
- **Product Reviews & Ratings**: Customers can write product reviews. Reviews undergo Admin moderation before being featured on customer product pages.
- **Persistent Authenticated Sessions**: Automatic JWT token persistence using `localStorage` and request authorization header injection (`Authorization: Bearer <jwt>`).
- **Server-Side Checkout & Pricing**: Subtotal, promo code discounts (e.g. `ELOW10`), shipping fees, and final totals are strictly computed on the server from MongoDB database prices to prevent client-side price tampering.
- **Stripe Integration & Inventory Control**: Verifies Stripe payment status before confirming orders and automatically decrements stock levels upon checkout completion.
- **Error Boundaries & Resiliency**: Built-in React Error Boundaries and robust backend middleware prevent application crashes under heavy concurrent usage.

### 🛡️ Admin Portal (`/admin`)
- **Real-Time Analytics Dashboard**: Displays revenue, order counts, product inventory stats, and stock alerts.
- **Product Catalog Management**: Full CRUD operations for products (Create, Read, Update, Delete) with image URLs, category tags, price, and stock counts.
- **Review Moderation**: Moderation workflow with **Accept** or **Delete** options. Accepted reviews are immediately published to the customer-facing storefront under the corresponding product.
- **Store Order Fulfillment**: Track customer orders, inspect order items, view payment status, and manage fulfillment states.

---

## 🛠️ Architecture & Tech Stack

```
                     ┌─────────────────────────────────────────┐
                     │          Vercel Frontend (React)        │
                     │  - React 19 + Vite + React Router v7   │
                     │  - Tailwind CSS v4 + Lucide Icons       │
                     │  - Error Boundaries & Auth Context     │
                     └────────────────────┬────────────────────┘
                                          │
                                HTTP / JWT Bearer
                                          │
                     ┌────────────────────▼────────────────────┐
                     │         Render Backend (Node/Express)   │
                     │  - Express REST Routes & Controllers   │
                     │  - Bcrypt Password Hashing + JWT Auth   │
                     │  - Server-side Financial Calculations   │
                     │  - Stripe Payment Status Verification   │
                     │  - Helmet + Rate Limiter Security      │
                     └────────────────────┬────────────────────┘
                                          │
                                   Mongoose ODM
                                          │
                     ┌────────────────────▼────────────────────┐
                     │      MongoDB Atlas Database Cluster     │
                     │  - Users, Products, Orders, Reviews     │
                     │  - Promos & Inventory Stock Control     │
                     └─────────────────────────────────────────┘
```

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Modern UI framework with JSX & React Router v7 |
| **Build & Tooling** | **Vite 8** | High-performance build setup and ESNext bundle execution |
| **Styling** | **Tailwind CSS v4** | Utility-first responsive CSS styling and custom color tokens |
| **Backend API** | **Node.js + Express** | Modular MVC backend (`routes/`, `controllers/`, `middleware/`, `config/`) |
| **Database** | **MongoDB Atlas / Mongoose** | Cloud NoSQL database with Mongoose schema modeling |
| **Authentication & Security** | **JWT + BcryptJS** | Signed JSON Web Tokens, hashed passwords, Helmet security headers, CORS protection |
| **Payment Processing** | **Stripe API** | Payment status verification and server-controlled checkout |
| **Testing Suite** | **Vitest + Supertest** | Automated integration tests running with `mongodb-memory-server` |

---

## 🖼️ Application Previews

### Storefront & Catalog
![Storefront Banner](frontend/public/banner-bg.png)

### Brand Identity & UI Design
![Elow Logo](frontend/public/logo.png)

---

## 📁 Repository Structure

```
elow/
├── backend/                    # Express REST API Server
│   ├── config/                 # Database (db.js) and Logger configuration
│   ├── controllers/            # Controller logic (auth, product, order, review)
│   ├── data/                   # Seed catalog & pre-hashed user credentials
│   ├── middleware/             # protect (JWT verification), admin (RBAC), errorMiddleware
│   ├── models/                 # Mongoose Schemas (User, Product, Order, Review, Promo)
│   ├── routes/                 # REST Route definitions
│   ├── tests/                  # Integration tests (Vitest, Supertest, mongodb-memory-server)
│   ├── app.js                  # Express app setup & route middleware registration
│   ├── server.js               # Server entry point & DB connection initialization
│   ├── seed.js                 # Database seed script
│   └── .env.example            # Backend environment variable template
│
├── frontend/                   # React 19 Frontend Application
│   ├── public/                 # Static assets (logos, banners, product images)
│   ├── src/
│   │   ├── components/         # UI Components, Error Boundaries, Drawers, Modals
│   │   ├── context/            # React Auth & Cart Context Providers
│   │   ├── pages/              # Home, Shop, ProductDetail, Cart, Checkout, Admin, Settings
│   │   ├── App.jsx             # Root App component with Error Boundary wrapper
│   │   └── main.jsx            # React entry point
│   ├── vercel.json             # Vercel SPA Routing Configuration
│   └── .env.example            # Frontend environment variable template
│
├── LICENSE                     # MIT Open Source License
├── package.json                # Root Monorepo workspace configuration
└── README.md                   # Project Documentation
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **MongoDB Atlas** cluster connection string (or local MongoDB)

### 2. Clone Repository
```bash
git clone https://github.com/Megha-r20/elow.git
cd elow
```

### 3. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 4. Configure Environment Variables
Copy the `.env.example` templates in both `backend` and `frontend`:

**Backend (`backend/.env`):**
```ini
PORT=5005
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/elow?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```ini
VITE_API_URL=http://localhost:5005
```

### 5. Seed the Database
```bash
cd backend
npm run seed
```

### 6. Start Development Servers
```bash
# Terminal 1 (Backend - http://localhost:5005)
cd backend && npm run dev

# Terminal 2 (Frontend - http://localhost:5173)
cd frontend && npm run dev
```

---

## 🧪 Automated Testing

The backend includes comprehensive integration tests powered by **Vitest**, **Supertest**, and **mongodb-memory-server**:

```bash
cd backend
npm test
```

### Verified Test Suites:
- 🔐 **Authentication & RBAC**: Register success/failure, bcrypt hashing, login success/failure, 401 Unauthorized for missing tokens, and 403 Forbidden for non-admin requests to `/api/admin/*`.
- 🛍️ **Orders & Inventory**: Server-calculated subtotal, discount, shipping, and total calculations, user ID linking, and automatic DB stock reduction upon order creation.
- 🏷️ **Promo Code Validation**: Server-side promo code verification and rejection of invalid codes (400 Bad Request).

---

## 🔌 REST API Reference

### Auth & User Management
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (password hashed with bcrypt) |
| `POST` | `/api/auth/login` | Public (Rate Limited) | Authenticate user and issue signed JWT |
| `GET` | `/api/auth/profile` | `protect` | Fetch current user profile |
| `PATCH` | `/api/auth/profile` | `protect` | Update profile information |

### Products & Reviews
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Fetch paginated products with category/price filters |
| `GET` | `/api/products/:id` | Public | Fetch single product details and accepted reviews |
| `POST` | `/api/products/:id/reviews` | `protect` | Submit a product review (queued for moderation) |

### Orders & Payments
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | `protect` | Create order with server-calculated totals & stock reduction |
| `GET` | `/api/orders/my-orders` | `protect` | Retrieve authenticated user's order history |
| `GET` | `/api/orders/:id` | `protect` | Retrieve specific order details |

### Admin Moderation & Management
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/products` | `protect`, `admin` | Create new product |
| `PUT` | `/api/admin/products/:id` | `protect`, `admin` | Update product details and inventory |
| `DELETE` | `/api/admin/products/:id` | `protect`, `admin` | Delete product from catalog |
| `GET` | `/api/admin/orders` | `protect`, `admin` | Retrieve all customer orders |
| `GET` | `/api/admin/reviews` | `protect`, `admin` | Retrieve pending reviews for moderation |
| `PATCH` | `/api/admin/reviews/:id/approve` | `protect`, `admin` | Accept review and display on product page |
| `DELETE` | `/api/admin/reviews/:id` | `protect`, `admin` | Delete rejected review |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
