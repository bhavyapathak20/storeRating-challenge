
import DashboardCard from "../components/dashboardCard"


export default function Home(){
    return(
        <>
        <div className="bg-gray-300 w-[40%] rounded-xl h-20 flex flex-col gap-3 justify-center items-center m-auto mt-10">
            <h1 className="font-semibold text-2xl" >Total Earning</h1>
            <p className="font-bold text-green-800">$43,019</p>
        </div>

        <div className="flex flex-row space-x-[10rem] mt-[10%] justify-center text-center">
            <DashboardCard title = "Total Users"  value = {30} Color = "bg-green-400"/>
            <DashboardCard title="Total Stores" value={17} Color="bg-blue-400" />
            <DashboardCard title="Total Ratings Submitted" value={7} Color="bg-amber-200" />
        </div>
        </>
    )

}


