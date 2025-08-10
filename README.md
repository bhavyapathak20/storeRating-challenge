# 🛍️ Store Rating Platform

## 📌 Overview
**A full-stack, role-based store rating platform** where administrators can manage users and stores, normal users can rate and view stores, and store owners can view ratings for their stores. Built with **React.js**, **Express.js**, **PostgreSQL**, and **Tailwind CSS**.

---

## 📂 Project Structure

### **Backend**
```
backend/
├── server.js # Main backend entry point, mounts all API routes and starts the server
├── config/
│ └── db.js # Database configuration and PostgreSQL client connection
├── controllers/
│ ├── adminController.js # Handles admin-related actions like creating admins and fetching stats
│ ├── authController.js # Manages user, admin, and store owner login logic with bcrypt verification
│ ├── storeController.js # Handles creation and retrieval of store data
│ └── userController.js # Handles creation and retrieval of user data
├── routes/
│ ├── adminRoutes.js # Defines admin-related API endpoints
│ ├── authRoutes.js # Defines authentication/login API endpoint
│ ├── storeRoutes.js # Defines store-related API endpoints
│ └── userRoutes.js # Defines user-related API endpoints
└── package.json # Backend dependencies and scripts
````

### **Frontend**
```
frontend/
├── src/
│ ├── App.jsx # Main React component setting up app routing
│ ├── index.jsx # React entry point rendering the app
│ ├── pages/
│ │ ├── login.jsx # Login page for all user roles
│ │ ├── register.jsx # Signup page for normal users and store owners
│ │ ├── adminDashboard.jsx # Admin interface for managing stores, users, and viewing stats
│ │ ├── userDashboard.jsx # Normal user interface for browsing and rating stores
│ │ ├── storeDashboard.jsx # Store owner interface for viewing received ratings
│ │ ├── addAdmin.jsx # Form for adding new admin users
│ │ ├── addStore.jsx # Form for adding new stores
│ │ ├── addUser.jsx # Form for adding new normal users
│ │ ├── viewStore.jsx # Table view of all stores with sorting and filtering
│ │ ├── viewUsers.jsx # Table view of all users with sorting and filtering
│ │ └── home.jsx # Dashboard cards displaying total counts for users, stores, and ratings
│ ├── tailwind.config.js # Tailwind CSS configuration file
│ └── package.json # Frontend dependencies and scripts
```

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(200),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(100) UNIQUE NOT NULL,
    admin_address VARCHAR(200),
    admin_password VARCHAR(255) NOT NULL
);

CREATE TABLE store (
    id SERIAL PRIMARY KEY,
    store_name VARCHAR(100) NOT NULL,
    store_owner VARCHAR(50) NOT NULL,
    store_email VARCHAR(90) UNIQUE NOT NULL,
    store_address VARCHAR(200) NOT NULL
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES store(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (store_id, user_id)
);
