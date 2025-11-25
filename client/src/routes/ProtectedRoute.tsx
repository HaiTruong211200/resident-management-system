import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  //   const { isAuthenticated } = useAppContext();
  const isAuthenticated = true;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
