import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const [user, setUser] = useState(stored);
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/");
      return;
    }
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/stores?user_id=${user.id}`);
      const data = await res.json();
      setStores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (storeId, value) => {
    try {
      const res = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: storeId, user_id: user.id, rating: value }),
      });
      if (!res.ok) throw new Error("Failed");
      await fetchStores();
    } catch (err) {
      console.error(err);
      alert("Could not submit rating");
    }
  };

  const filtered = stores.filter(
    (s) =>
      s.store_name.toLowerCase().includes(query.toLowerCase()) ||
      (s.store_address && s.store_address.toLowerCase().includes(query.toLowerCase()))
  );

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Stores</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Signed in as: <span className="font-medium">{user?.name}</span>
            </span>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
              Logout
            </button>
          </div>
        </header>

        <div className="mb-4 flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or address"
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={fetchStores}
            className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
              >
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {s.store_name}
                  </div>
                  <div className="text-sm text-gray-500">{s.store_address}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Avg rating:{" "}
                    <span className="font-semibold">
                      {s.avg_rating ?? "—"}
                    </span>{" "}
                    ({s.rating_count ?? 0})
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Your rating:{" "}
                    <span className="font-semibold">
                      {s.user_rating ?? "Not rated"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => submitRating(s.id, n)}
                      className={`px-3 py-1 rounded ${
                        s.user_rating === n
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
