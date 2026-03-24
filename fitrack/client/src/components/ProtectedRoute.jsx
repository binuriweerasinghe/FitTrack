import { Navigate } from "react-router-dom";
import { getUserId } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = !!getUserId();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
