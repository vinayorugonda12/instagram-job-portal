import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { adminAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!adminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;