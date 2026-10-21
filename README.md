# 🦁 MachoBeast E-Commerce Platform

> Premium Fitness & Supplement E-Commerce Platform engineered with a high-performance MERN stack, intuitive Amazon-grade shopping UX, interactive Drag & Drop to Cart, dynamic Admin Catalog Management, and MongoDB Atlas Cloud Database.

---

## 📁 Monorepo Structure

```text
machobeast/
├── Machobeast_frontend/      # React 18, Vite, Redux Toolkit, Tailwind CSS, Drag & Drop
│   ├── src/
│   │   ├── components/       # Reusable UI, Layout, Product Cards, Cart Drop Zone
│   │   ├── pages/            # Home, Shop, Admin Dashboard, Product Detail, Checkout
│   │   ├── redux/            # Cart, Product, and Auth state slices
│   │   ├── services/         # Axios API client with auth interceptors
│   │   └── data/             # Supplement catalog & fallback data
│   └── package.json
│
├── Machobeast_backend/       # Node.js, Express, Mongoose, MongoDB Atlas, JWT Auth
│   ├── src/
│   │   ├── config/           # Database pooling & environment variables
│   │   ├── controllers/      # Product, Auth, Order controllers
│   │   ├── models/           # Mongoose schemas (Product, User, Order)
│   │   ├── routes/           # RESTful API route definitions
│   │   └── scripts/          # Database seeding & connection testing
│   └── package.json
│
├── .gitignore                # Production ignore rules (node_modules, .env, dist)
└── README.md
```

---

## ⚡ Key Features

- **🛒 Interactive Drag & Drop Cart**: Drag any supplement card directly onto the floating cart or navbar cart with real-time visual feedback and audio chime.
- **🛡️ Dynamic Admin Dashboard (`/admin`)**:
  - Add, edit, or delete supplements dynamically without code modifications.
  - Drag & drop image upload with instant live card preview.
  - Multi-variant management (flavors, weights, pricing).
- **☁️ Cloud Database (MongoDB Atlas)**:
  - Connection pooling with automatic reconnection and sub-100ms latency.
  - Text search indexes across title, brand, and description.
- **💎 Premium Fitness Catalog**: Pre-seeded with leading supplements (Divine Nutrition, Wellcore, Alpino, Maxures, Muscle Doctor).
- **🔒 Production Ready Security**: Protected routes, JWT cookie/header authentication, URL-safe database URI handling, and robust CORS origin control.

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd Machobeast_backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and insert your MongoDB Atlas URI
cp .env.example .env

# Verify database connection
npm run test:db

# Seed supplement catalog & admin account
npm run seed

# Start development server
npm run dev
```

Default Admin Credentials:
- **Email**: `admin@machobeast.com`
- **Password**: `Admin@12345`

### 2. Frontend Setup
```bash
cd Machobeast_frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, React Router v6, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose ODM, JWT, Bcrypt
- **Cloud Database**: MongoDB Atlas (M0 Free Tier / Multi-AZ)
