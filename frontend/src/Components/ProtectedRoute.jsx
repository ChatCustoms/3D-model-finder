import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, loggedIn }) => {
  console.log("ProtectedRoute - loggedIn:", loggedIn);
  console.log("ProtectedRoute - typeof loggedIn:", typeof loggedIn);
  console.log("ProtectedRoute - all props:", { Component, loggedIn });
  return loggedIn ? Component : <Navigate to="/" replace />;
};

export default ProtectedRoute;
