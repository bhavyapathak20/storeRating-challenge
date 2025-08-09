import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddAdmin from "./addAdmin";
import AddUser from "./addUser";
import AddStore from "./addStore";
import ViewUsers from "./viewUsers";
import ViewStore from "./viewStore";

export default function AdminDashboard() {
  const [selected, setSelected] = useState("dashboard");
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (selected === "dashboard") {
      fetchStats();
    }
  }, [selected]);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const renderContent = () => {
    switch (selected) {
      case "addAdmin":
        return <AddAdmin />;
      case "addUser":
        return <AddUser />;
      case "addStore":
        return <AddStore />;
      case "viewUsers":
        return <ViewUsers />;
      case "viewStore":
        return <ViewStore />;
      default:
        return (
          <div>
            <h1 className="text-2xl font-bold text-indigo-700 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
                <p className="text-3xl font-bold text-indigo-700">{stats.total_users}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">Total Stores</h2>
                <p className="text-3xl font-bold text-indigo-700">{stats.total_stores}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">Total Ratings</h2>
                <p className="text-3xl font-bold text-indigo-700">{stats.total_ratings}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setSelected("dashboard")}
            className="block w-full text-left hover:bg-indigo-600 p-2 rounded"
          >
            Dashboard
          </button>
          <button
            onClick={() => setSelected("addAdmin")}
            className="block w-full text-left hover:bg-indigo-600 p-2 rounded"
          >
            Add Admin
          </button>
          <button
            onClick={() => setSelected("addUser")}
            className="block w-full text-left hover:bg-indigo-600 p-2 rounded"
          >
            Add User
          </button>
          <button
            onClick={() => setSelected("addStore")}
            className="block w-full text-left hover:bg-indigo-600 p-2 rounded"
          >
            Add Store
          </button>
          <button
            onClick={() => setSelected("viewUsers")}
            className="block w-full text-left hover:bg-indigo-600 p-2 rounded"
          >
            View Users
          </button>
          <button
            onClick={() => setSelected("viewStore")}
            className="block w-full text-left hover:bg-indigo-600 p-2 rounded"
          >
            View Stores
          </button>
        </nav>
        <button
          onClick={logout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">{renderContent()}</main>
    </div>
  );
}
