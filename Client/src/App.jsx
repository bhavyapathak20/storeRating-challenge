// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/userDashboard";
import StoreDashboard from "./pages/storeDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/store-dashboard" element={<StoreDashboard />} />
    </Routes>
  );
}
