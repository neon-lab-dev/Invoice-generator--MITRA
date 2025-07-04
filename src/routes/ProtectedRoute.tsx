import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }:{children:ReactNode}) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
