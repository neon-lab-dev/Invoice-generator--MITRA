import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../layout/DashboardLayout";
import Users from "../pages/Dashboard/Users/Users";
import Invoices from "../pages/Dashboard/Invoices/Invoices";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    // element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element:<Dashboard />,
      },
      {
        path: "users",
        element:<Users />,
      },
      {
        path: "invoices",
        element:<Invoices />,
      },
    ],
  },
]);
