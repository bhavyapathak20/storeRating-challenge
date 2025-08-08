import {createRoot} from "react-dom/client";
import Login from "./pages/login";
import Register from "./pages/register";
import AdminDashboard from "./pages/adminDashboard";

export default function App(){
  return(
    <>
    {/* <Register/> */}
    {/* <Login/> */}
    <AdminDashboard/>
    </>
  )
}