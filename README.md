# 🧵 Powerloom Management System - Backend

The **Powerloom Backend** is a robust, RESTful API built using **Node.js**, **Express.js**, and **MongoDB Atlas**.  
It manages all core business logic, including **authentication**, **loom operations**, **product and order management**, and **data analytics**, while supporting **real-time updates** through **Socket.IO**.

---

## 🚀 Features

- 🔐 **User Authentication & Authorization** (JWT)
- 🧶 **Loom Management** — Track and update loom machine data
- 📦 **Product Management** — CRUD operations for inventory
- 🧾 **Order Processing** — Manage and monitor order statuses
- 📊 **Analytics Dashboard** — Generate reports and production statistics
- ⚡ **Real-time Updates** — Powered by Socket.IO
- 🌐 **Cloud Database** — Hosted on MongoDB Atlas
- 🧩 **CORS-Enabled REST API** for seamless frontend integration

---

## 🏗️ Tech Stack

| Technology | Description |
|-------------|-------------|
| **Node.js** | Runtime environment |
| **Express.js** | Backend framework |
| **MongoDB Atlas** | NoSQL cloud database |
| **Socket.IO** | Real-time communication |
| **JWT** | Secure token-based authentication |
| **Render** | Backend deployment platform |

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory and include:

env
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
PORT=5000


---

git clone https://github.com/yourusername/powerloom-backend.git
cd powerloom-backend
npm install
npm start
http://localhost:5000

