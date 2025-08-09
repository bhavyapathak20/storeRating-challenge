import { useState } from "react";
import axios from 'axios';

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users", formData);
      console.log("User added:", res.data);
      alert("User added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          minLength={10}
          maxLength={60}
          required
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          maxLength={400}
          required
          className="w-full p-2 border rounded"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          minLength={8}
          maxLength={16}
          required
          className="w-full p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
