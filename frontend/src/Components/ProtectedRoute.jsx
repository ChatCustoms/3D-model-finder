import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, loggedIn }) => {
  console.log("ProtectedRoute - loggedIn:", loggedIn);
  return loggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
