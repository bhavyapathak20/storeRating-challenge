import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/stores")
      .then((res) => {
        setStores(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stores:", err);
        setError("Failed to load stores.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading stores...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <div 
          key={store.id} 
          className="bg-white shadow-lg rounded-lg p-5 border border-gray-200 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">{store.store_name}</h2>
          <p className="text-gray-600">Owner: {store.store_owner}</p>
          <p className="text-gray-600">{store.store_email}</p>
          <p className="text-sm text-gray-500">{store.store_address}</p>
        </div>
      ))}
    </div>
  );
}
