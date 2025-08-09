import Navbar from "../components/navbar"
import { Route, Routes } from "react-router-dom"
import AddUser from "./addUser"
import AddAdmin from "./addAdmin"
import AddStore from "./addStore"
import Home from "./home"
import ViewUsers from "./ViewUsers"
import ViewStores from "./viewStore"
// Has access to a dashboard displaying:
// ○ Total number of users
// ○ Total number of stores
// ○ Total number of submitted ratings


export default function AdminDashboard(){
    return(
        <>
            <Navbar/>
            <Routes>
                <Route path="add-user" element={<AddUser/>}/>
                <Route path="add-store" element={<AddStore/>}/>
                <Route path="add-admin" element={<AddAdmin/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path='view-users' element={<ViewUsers/>}/>
                <Route path='view-stores' element={<ViewStores/>}/>
            </Routes>
        </>
    )
}