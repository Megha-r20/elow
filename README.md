# ☁️ elow — stationery • lifestyle • little joys

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript%2FJSX-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-REST_API-000000?logo=express&logoColor=white)](https://expressjs.com/)

An aesthetic, full-stack e-commerce application inspired by Pinterest design principles. Built with **React (JavaScript / JSX)**, **Vite**, **Tailwind CSS**, and a **Node.js / Express** REST API backend.

---

## ✨ Features

### 🛍️ Storefront & Shopping Experience
* **Pinterest-Inspired Aesthetic**: Soft pastel sage green (`#5E8C77`), warm cream (`#FAF7F2`), glassmorphism floating navbar, and subtle micro-interactions.
* **Category-Matched Product Imagery**: 150 curated stationery items with category-accurate visuals (Journals, Pens & Writing Tools, Washi Tape & Stickers, Desk Organization, Art Supplies, Gift Bundles).
* **Tactile Card Glow Effect**: Custom interactive background glow on `:hover` and `:active` click events across all product cards and category chips.
* **Multi-Faceted Search & Filter System**: Real-time category filtering, price slider range selection, in-stock toggle, search query matching, and price sorting.
* **Slide-Out Cart & Checkout**: Interactive cart drawer with item counter, dynamic subtotal calculation, discount coupon support (`ELOW10` for 10% off), and checkout flow.

### 👤 User Account & Profile Settings
* **Dedicated Profile Settings (`/settings`)**: Update personal details including Full Name, Phone Number, Short Bio, Avatar URL, and Default Shipping Address with instant backend REST API synchronization.
* **Account Modal**: Access order history with itemized breakdowns, tracking updates, and saved delivery addresses.

### ⚡ Admin Portal (`/admin`)
* **Store Analytics Dashboard**: Real-time overview of total revenue, order count, total products, and low-stock alerts.
* **Full Product Inventory Management**:
  * **Add New Product**: Form modal with image preview, category selector, pricing, and stock assignment.
  * **Edit Existing Product**: Live editor (`PUT /api/admin/products/:id`) allowing instant updates to title, description, category, price, stock levels, and imagery.
  * **Delete Product**: One-click removal of discontinued items.
* **Order Management**: Monitor customer orders and toggle fulfillment statuses.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 (JavaScript / JSX) |
| **Build Tooling** | Vite 8 + ESNext |
| **Routing** | React Router v7 |
| **Styling & Icons** | Tailwind CSS v4 + Vanilla CSS Tokens + Lucide React Icons |
| **Backend Environment** | Node.js + Express.js REST API |
| **Middleware** | CORS, Express JSON Body Parser, Defensive Error Handling |
| **State Management** | React Context API (`AuthContext`, `CartContext`) + LocalStorage |

---

## 📁 Clean Project Structure

```
elow/
├── backend/
│   ├── data/
│   │   └── products.js        # Seed catalog data (150 stationery items)
│   ├── server.js              # Express REST API & admin endpoints
│   └── package.json           # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── logo.png           # Original elow brand logo
│   ├── src/
│   │   ├── components/        # UI components (Layout, Modals, Cards, Cart)
│   │   │   ├── AccountModal.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ui.jsx
│   │   ├── context/           # React Context state management
│   │   │   ├── AuthContext.jsx
│   │   │   └── index.jsx
│   │   ├── data/              # Frontend product models & image maps
│   │   │   └── index.js
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── index.js
│   │   ├── pages/             # Application pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Shop.jsx
│   │   ├── App.jsx            # Application root
│   │   ├── index.css          # Design system tokens & animations
│   │   ├── main.jsx           # React entry point
│   │   └── routes.jsx         # Client-side router definition
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite dev server configuration & API proxy
│   └── package.json           # Frontend dependencies
│
├── .gitignore                 # Git ignore rules
├── package.json               # Root monorepo workspace scripts
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Megha-r20/elow.git
cd elow
```

### 2. Install Dependencies
You can install dependencies for both `backend` and `frontend` using the root monorepo script:
```bash
npm run install:all
```

Or install manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Run Development Servers

#### Running Backend (`http://localhost:5005`)
```bash
# Option A: From project root
npm run dev:backend

# Option B: Inside backend folder
cd backend
node server.js
```

#### Running Frontend (`http://127.0.0.1:5173`)
In a second terminal window:
```bash
# Option A: From project root
npm run dev:frontend

# Option B: Inside frontend folder
cd frontend
npm run dev
```

---

## 🔌 API Endpoints Reference

### Public / Storefront
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all 150 products |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `POST` | `/api/auth/login` | Authenticate user or admin account |
| `POST` | `/api/auth/register` | Register new customer account |
| `PATCH` | `/api/auth/profile` | Update authenticated user profile |

### Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/orders` | Submit new order |
| `GET` | `/api/orders/my-orders` | Fetch orders for current user |

### Admin Operations
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/products` | Create new product |
| `PUT` | `/api/admin/products/:id` | Edit existing product details |
| `DELETE` | `/api/admin/products/:id` | Delete product from store |
| `GET` | `/api/admin/orders` | Fetch all store orders |

---

## 🔐 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@elow.com` | `admin123` | Full access to `/admin` dashboard & product editor |
| **User** | `user@elow.com` | `user123` | Access to storefront, cart, orders, and `/settings` |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
