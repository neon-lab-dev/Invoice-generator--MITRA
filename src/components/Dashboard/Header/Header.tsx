import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Derive page title from path
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard/invoices":
        return "Manage Invoices";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
  setIsLoading(true);
  setTimeout(() => {
    setIsLoading(false);
    Cookies.remove("accessToken");
    navigate("/", { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, 1500);
};


  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow w-full">
      {/* Left side: page title */}
      <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>

      {/* Right side: logout button */}
      <button
        type="button"
        className={`rounded-md px-4 w-[200px] py-2 font-medium text-white cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
          isLoading
            ? "bg-primary-10/60 cursor-not-allowed"
            : "bg-primary-10 hover:bg-primary-100 active:scale-95"
        }`}
        disabled={isLoading}
        onClick={handleLogout}
      >
        {isLoading ? "Logging Out..." : "Logout"}
      </button>
    </div>
  );
};

export default Header;
