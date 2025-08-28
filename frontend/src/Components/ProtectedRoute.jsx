import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, loggedIn }) => {
  console.log("ProtectedRoute - loggedIn:", loggedIn);
  if (loggedIn === undefined || loggedIn === null) {
    return null;
  }
  return loggedIn ? children : <Navigate to="/" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  loggedIn: PropTypes.bool,
};

export default ProtectedRoute;
