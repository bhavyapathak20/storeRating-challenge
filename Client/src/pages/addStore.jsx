import { useState } from "react";
import axios from "axios";

export default function AddStore() {
  const [formData, setFormData] = useState({
    store_name: "",
    store_owner: "",
    store_email: "",
    store_address: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/store", formData);
      console.log("Store Added:", res.data);
      alert("Store added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add store");
    }
  }; 

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Add a store</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="store_name"
          placeholder="Store Name"
          minLength={10}
          maxLength={60}
          required
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="store_owner"
          placeholder="Store Owner"
          minLength={10}
          maxLength={60}
          required
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="store_email"
          placeholder="Store Email"
          required
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="store_address"
          placeholder="Store Address"
          maxLength={400}
          required
          className="w-full p-2 border rounded"
          value={formData.address}
          onChange={handleChange}
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Add Store
        </button>
      </form>
    </div>
  );
}
