# ☁️ elow — stationery • lifestyle • little joys

An aesthetic, full-stack e-commerce application inspired by Pinterest design principles. Built with **React (JSX)**, **Vite**, **Tailwind CSS**, and **Node.js / Express**.

---

## ✨ Features

### 🛍️ Storefront & Shopping Experience
* **Pinterest Aesthetic Design**: Styled with soft sage green (`#5E8C77`), warm cream (`#FAF7F2`), glassmorphism header navigation, and smooth hover micro-interactions.
* **Category-Matched Product Imagery**: 150 curated stationery items matching their exact categories (Journals, Writing Tools, Washi Tapes, Desk Tools, Art Supplies, Gift Sets).
* **Interactive Background Glow Effect**: Tactile active/hover glow feedback when clicking product cards and category chips.
* **Search, Filter & Sorting**: Multi-faceted filter system by category, price range, stock availability, search query, and price/popularity sorting.
* **Interactive Cart Drawer & Checkout**: Slide-out cart drawer with item counter, dynamic subtotal calculation, coupon promo codes (`ELOW10`), and multi-step checkout flow.

### 👤 User Account & Profile Settings
* **Dedicated Profile Settings (`/settings`)**: Customize user profile details including Full Name, Phone Number, Short Bio, Avatar URL, and Default Shipping Address with instant REST API backend persistence.
* **Account Dashboard Modal**: View order history, item breakdowns, tracking statuses, and managed shipping addresses.

### ⚡ Admin Portal (`/admin`)
* **Live Analytics**: Overview of total revenue, order metrics, customer count, and low-stock alerts.
* **Product Catalog Management**:
  * **Add New Products**: Create products with image preview, category assignment, price, and stock levels.
  * **Edit Existing Products**: Modal editor (`PUT /api/admin/products/:id`) to update product names, descriptions, prices, stock count, and images in real time.
  * **Delete Products**: Remove out-of-stock or discontinued items.
* **Order Management**: Monitor customer orders and update fulfillment statuses.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React 19 (JavaScript / JSX)
* **Build Tool**: Vite 8
* **Routing**: React Router v7
* **Styling**: Tailwind CSS v4 + Custom Vanilla CSS Design System
* **Icons**: Lucide React

### Backend
* **Environment**: Node.js
* **Framework**: Express.js REST API
* **Middleware**: CORS, Express JSON Parser, Defensive Input Handling & Global Error Middleware
* **Storage**: In-memory database with persistent JSON data seeding

---

## 📁 Project Structure

```
elow/
├── backend/
│   ├── data/
│   │   └── products.js        # Seed data (150 curated stationery items)
│   ├── server.js              # Express REST API & admin endpoints
│   └── package.json           # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── logo.png           # elow brand logo
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── AccountModal.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ui.jsx
│   │   ├── context/           # React Context state management
│   │   │   ├── AuthContext.jsx
│   │   │   └── index.jsx
│   │   ├── data/              # Frontend product definitions & imagery
│   │   │   └── index.js
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── index.js
│   │   ├── pages/             # Application route views
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Shop.jsx
│   │   ├── App.jsx            # Application root
│   │   ├── index.css          # Design tokens & custom styling
│   │   ├── main.jsx           # React entry point
│   │   └── routes.jsx         # Router configuration
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration & proxy settings
│   └── package.json           # Frontend dependencies
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Megha-r20/elow.git
cd elow
```

### 2. Start the Backend Server
```bash
# Navigate to backend directory
cd backend
npm install

# Start the Express server
node server.js
```
The backend server will run on `http://localhost:5005`.

### 3. Start the Frontend Application
In a new terminal window:
```bash
# Navigate to frontend directory
cd frontend
npm install

# Start the Vite development server
npm run dev
```
The frontend dev server will launch at `http://127.0.0.1:5173`.

---

## 🔌 API Endpoints Reference

### Public / Storefront
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all 150 products |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `POST` | `/api/auth/login` | Authenticate user or admin |
| `POST` | `/api/auth/register` | Register new customer account |
| `PATCH` | `/api/auth/profile` | Update authenticated user profile |

### Customer Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/orders` | Submit new checkout order |
| `GET` | `/api/orders/my-orders` | Fetch orders for current user |

### Admin Operations
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/products` | Add a new product to inventory |
| `PUT` | `/api/admin/products/:id` | Update existing product details |
| `DELETE` | `/api/admin/products/:id` | Remove product from store |
| `GET` | `/api/admin/orders` | Fetch all customer orders |

---

## 🔐 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@elow.com` | `admin123` |
| **User** | `user@elow.com` | `user123` |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
