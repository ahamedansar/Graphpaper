# Graphpaper — B2B Wholesale Platform

A full-stack B2B wholesale e-commerce platform for Graphpaper, built with **React.js** (frontend) and **Express.js + Node.js** (backend), backed by **MongoDB Atlas**.

---

## 🚀 Live Demo

| Component | URL |
|-----------|-----|
| Frontend  | _Coming Soon — Vercel_ |
| Backend   | _Coming Soon — Vercel_ |

---

## ✨ Features

### 👤 Authentication
- Register / Login with JWT-based auth
- Forgot Password & Reset Password via email (Nodemailer)
- Role-based access control: **User (Retailer)**, **Admin**, **Delivery Boy**
- Password strength meter, show/hide toggle

### 🛍️ Customer (Retailer) Side
- Product catalog with search, filter by category & gender
- Product details, shopping cart, wishlist
- Checkout with **Razorpay UPI/Card**, Google Pay QR, Bank Transfer, COD
- Order tracking with live status timeline
- Cancel order (Pending/Confirmed only)
- Download Invoice (PDF)
- My Profile — edit name, phone, change password
- My Orders history

### 🛠️ Admin Panel
- Dashboard with live KPI stats
- **Analytics** — 6-month revenue bar chart, category pie chart, top products, top customers (Recharts)
- **Export Excel Report** — download full order & revenue data (xlsx)
- Add / Edit / Delete products with **Cloudinary image upload**
- Orders — Accept, Assign to delivery boy, Mark as Paid
- Manage Customers, Feedbacks, Contact Messages

### 🚴 Delivery Panel
- View assigned orders
- Click-to-call customer (tel: link)
- Open delivery address in Google Maps
- Update status: Picked Up → On the Way → Delivered
- Confirm COD cash collected

### 📧 Email Notifications
- Password reset link
- Order Confirmed
- Out for Delivery
- Order Delivered

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, React Router v6, Bootstrap |
| State Management | Context API (Auth, Cart) |
| HTTP Client | Axios |
| Charts | Recharts |
| Excel Export | xlsx (SheetJS) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT + bcryptjs |
| Image Upload | Multer + Cloudinary |
| Payments | Razorpay |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Vercel |

---

## 📁 Folder Structure

```
graphpaper/
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── config/
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        │   ├── admin/
        │   └── delivery/
        ├── context/
        ├── utils/
        ├── App.jsx
        └── index.css
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account (for payments)

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`):
```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

```bash
npm run dev     # Start backend (port 5001)
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file:
```env
VITE_API_URL=http://localhost:5001/api
```

```bash
npm run dev     # Start frontend (port 5173)
```

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **User (Retailer)** | Browse products, place orders, track orders, manage profile |
| **Admin** | Full dashboard, manage products/orders/customers, analytics |
| **Delivery Boy** | View assigned deliveries, update status, confirm COD |

---

## 📦 API Endpoints (Key)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/products` | Get all products |
| POST | `/api/orders` | Place an order |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment |
| GET | `/api/orders` | Get all orders (Admin) |
| PUT | `/api/orders/:id/pay` | Mark as paid (Admin) |

---

## 📄 License

This project is for educational/business purposes. All rights reserved © 2025 Graphpaper.
