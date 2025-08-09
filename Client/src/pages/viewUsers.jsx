import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users") // change URL if needed
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <div 
          key={user.id} 
          className="bg-white shadow-lg rounded-lg p-5 border border-gray-200 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 capitalize">Role: {user.address}</p>
        </div>
      ))}
    </div>
  );
}
