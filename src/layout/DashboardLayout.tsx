import { Outlet } from "react-router-dom";
import Header from "../components/Dashboard/Header/Header";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="w-full">
        <Header/>
        <div className="px-6 py-4">
            <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
