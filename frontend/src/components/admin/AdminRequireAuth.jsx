import { useContext } from "react";
import { AdminAuthContext } from "@components/context/AdminAuth";
import { Navigate } from "react-router";

export const AdminRequireAuth = ({ children }) => {
  const { user } = useContext(AdminAuthContext);

  if (!user) {
    return <Navigate to={`/admin/login`} />;
  }

  return children;
};
