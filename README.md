**SMM Panel – Full Stack Social Media Marketing Platform**

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-purple?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## 📌 Overview

**SMM Panel** is a production-ready full-stack Social Media Marketing platform built using:

* **Frontend:** React + Vite + Tailwind CSS
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **Authentication:** JWT with HTTP-only cookies
* **Payments:** Razorpay Integration

This application enables users to purchase social media services (followers, likes, views, etc.) while providing a powerful admin dashboard to manage services, orders, users, and payments.

The project demonstrates strong backend architecture, secure authentication practices, payment gateway integration, and scalable API design.

---

## 🔑 Core Features

### 👤 User Functionality

* Secure user registration & login (JWT authentication)
* Wallet balance management
* Add funds using Razorpay
* Place new SMM service orders
* Track order status in real-time
* View complete order history
* Browse services by category
* Update profile & password

### 🛠 Admin Functionality

* Role-based access control (Admin/User)
* Admin dashboard with analytics & statistics
* Full CRUD operations for services
* Manage users (activate, deactivate, edit)
* View and update all orders
* Manual wallet fund adjustments
* Monitor transactions & revenue

---

## 🧠 Technical Highlights

* RESTful API architecture
* Secure JWT authentication with HTTP-only cookies
* Role-based authorization middleware
* Razorpay payment gateway integration
* SMM Provider API integration
* Automated cron jobs for order updates
* Modular backend structure (controllers, services, middleware)
* Clean, reusable React component architecture
* Responsive UI built with Tailwind CSS

---

## 🏗 Architecture

### Backend Stack

* Node.js
* Express.js
* MongoDB (Mongoose ODM)
* JWT Authentication
* Razorpay API
* External SMM Provider API

### Frontend Stack

* React (Functional Components + Hooks)
* Vite (Fast build tool)
* Tailwind CSS
* Context API for state management
* Protected Routes & Role Guards

---

## 📂 Project Structure

```
SMM Panel/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── README.md
```

The architecture follows separation of concerns and scalable backend design principles.

🏗 **System Architecture flowchart LR**

    %% Client Layer
    A[User Browser] --> B[React Frontend<br/>Vite + Tailwind]

    %% API Layer
    B -->|REST API (HTTPS)| C[Express Server<br/>Node.js Backend]

    %% Authentication
    C --> D[JWT Auth<br/>HTTP-only Cookies]

    %% Database
    C --> E[(MongoDB Database)]

    %% External Services
    C --> F[SMM Provider API]
    C --> G[Razorpay Payment Gateway]

    %% Cron Jobs
    C --> H[Cron Jobs<br/>Order Status Updates]

    %% Data Flow Labels
    F -->|Order Status| C
    G -->|Payment Verification| C

🧱 Architecture Explanation
1️⃣ Client Layer (Frontend)

Built using React + Vite

Styled with Tailwind CSS

Handles UI rendering, routing, and API calls

Stores JWT securely via HTTP-only cookies

2️⃣ API Layer (Backend)

Node.js + Express

RESTful API structure

Middleware-based authentication & role authorization

Handles business logic and validation

3️⃣ Database Layer

MongoDB with Mongoose

Stores:

Users

Services

Orders

Wallet Transactions

4️⃣ External Integrations

SMM Provider API → Places & tracks external service orders

Razorpay API → Handles secure payments and wallet funding

5️⃣ Background Jobs

Cron jobs periodically:

Check provider order status

Update database

Sync order states

🔐 Security Flow

User logs in → Backend generates JWT

JWT stored in HTTP-only cookie

Protected routes validate token via middleware

Admin routes verify role before execution

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js v18+
* MongoDB
* npm or yarn

---

### 🔹 Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smm_panel
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```

Run server:

```bash
npm run dev
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
```

---

## 🔐 Security Practices

* HTTP-only cookies for JWT storage
* Environment variable protection
* Secure Razorpay webhook handling
* Role-based route protection
* Input validation & error handling

---

## 📊 Database Models

* **User**
* **Service**
* **Order**
* **WalletTransaction**

Designed with relational references using MongoDB ObjectIds for efficient data linking.

---

## 🚀 Deployment

### Backend

* Set `NODE_ENV=production`
* Configure production MongoDB
* Set secure JWT secret
* Configure Razorpay production keys
* Run `npm start`

### Frontend

* Build with `npm run build`
* Deploy `dist/` to Vercel / Netlify
* Configure API base URL

---

## 🏷 SEO & Search Keywords

`SMM Panel` `Social Media Marketing Platform` `Full Stack MERN Project`
`React Node.js MongoDB Project` `JWT Authentication` `Razorpay Integration`
`Admin Dashboard` `Ecommerce Backend` `REST API Project`
`Role Based Access Control` `Full Stack Developer Portfolio Project`

---

## 🎯 What This Project Demonstrates

* Advanced full-stack development skills
* Secure authentication & authorization
* Payment gateway integration
* Clean REST API design
* Scalable backend architecture
* Real-world production use case

---

## 📄 License

MIT License
