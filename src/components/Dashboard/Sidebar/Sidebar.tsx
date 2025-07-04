import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <MdOutlineDashboardCustomize size={18} />,
  },
  {
    name: "Invoices",
    path: "/dashboard/invoices",
    icon: <LiaFileInvoiceSolid size={18} />,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`${
        isOpen ? "w-[260px]" : "w-[60px]"
      } sticky top-0 transition-all duration-300 bg-secondary-60 text-white shadow-lg flex flex-col min-h-screen h-full`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-3 hover:bg-primary-10/60 transition-colors self-end"
      >
        {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
      </button>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 p-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                isActive
                  ? "bg-primary-10/30 text-primary-10 font-semibold"
                  : "hover:bg-primary-10/80 text-white"
              }`}
            >
              {/* Show Icon always */}
              <span>{link.icon}</span>
              {/* Show text only when sidebar is open */}
              {isOpen && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
