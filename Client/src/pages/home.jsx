import DashboardCard from "../components/dashboardCard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/count")
      .then((res) => setUsers(res.data.total))
      .catch((err) => console.error("Error fetching users count:", err));
  }, []);

  return (
    <>
      <div className="bg-gray-300 w-[40%] rounded-xl h-20 flex flex-col gap-3 justify-center items-center m-auto mt-10">
        <h1 className="font-semibold text-2xl">Total Earning</h1>
        <p className="font-bold text-green-800">$43,019</p>
      </div>

      <div className="flex flex-row space-x-[10rem] mt-[10%] justify-center text-center">
        <DashboardCard title="Total Users" value={users} Color="bg-green-400" />
        <DashboardCard title="Total Stores" value={17} Color="bg-blue-400" />
        <DashboardCard title="Total Ratings Submitted" value={7} Color="bg-amber-200" />
      </div>
    </>
  );
}
