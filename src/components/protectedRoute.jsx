import { Navigate, useLocation } from "react-router-dom";
import { useUserData } from "../contexts/UserContext";

function ProtectedRoute({ children }) {
  const { userData } = useUserData();
  const location = useLocation();

  // If userData is still null (loading state), don't redirect yet
  if (userData === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // If no user data (i.e., not logged in), redirect to login page
  if (!userData) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
