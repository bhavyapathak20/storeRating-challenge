import { useState } from "react";
import axios from "axios";

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    admin_name: "",
    admin_email: "",
    admin_address: "",
    admin_password: ""
  }); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin", formData);
      console.log("Admin Added:", res.data);
      alert("Admin added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add Admin");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="admin_name"
          placeholder=" Admin's Name"
          minLength={10}
          maxLength={60}
          required
          className="w-full p-2 border rounded"
          value={formData.admin_name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="admin_email"
          placeholder="Admin's Email"
          required
          className="w-full p-2 border rounded"
          value={formData.admin_email}
          onChange={handleChange}
        />
        <textarea
          name="admin_address"
          placeholder="Address"
          maxLength={400}
          required
          className="w-full p-2 border rounded"
          value={formData.admin_address}
          onChange={handleChange}
        />
        <input
          type="password"
          name="admin_password"
          placeholder="Password"
          minLength={8}
          maxLength={16}
          required
          className="w-full p-2 border rounded"
          value={formData.admin_password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Add As Admin
        </button>
      </form>
    </div>
  );
}
