import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StoreDashboard() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stored || stored.role !== "store") {
      navigate("/");
      return;
    }
    fetchStore();
  }, []);

  const fetchStore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/stores`);
      const all = await res.json();
      const myStore = all.find((s) => s.store_email === stored.email);
      if (!myStore) {
        alert("Could not find your store.");
        return;
      }
      setStore(myStore);
      const rres = await fetch(`http://localhost:5000/api/ratings/store/${myStore.id}`);
      const rjson = await rres.json();
      setRatings(rjson.ratings || []);
      setAvg(rjson.avg_rating);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Store Dashboard</h1>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
        </header>

        {loading ? (
          <div>Loading...</div>
        ) : (
          store && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <div className="text-xl font-semibold">{store.store_name}</div>
                <div className="text-sm text-gray-600">{store.store_address}</div>
                <div className="mt-2">
                  Average rating:{" "}
                  <span className="font-bold">{avg ?? "—"}</span>
                </div>
              </div>

              <h3 className="font-semibold mb-2">Ratings</h3>
              {ratings.length === 0 ? (
                <div className="text-sm text-gray-500">No ratings yet.</div>
              ) : (
                <ul className="space-y-3">
                  {ratings.map((r) => (
                    <li
                      key={r.id}
                      className="border rounded p-3 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">
                          {r.user_name ?? r.user_email ?? "User"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(r.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-lg font-semibold">{r.rating}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
