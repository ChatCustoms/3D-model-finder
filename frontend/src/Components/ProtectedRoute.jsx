import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, loggedIn }) => {
  console.log("ProtectedRoute - loggedIn:", loggedIn);
  if (loggedIn === undefined || loggedIn === null) {
    return null;
  }
  if (!loggedIn) {
    const loc = useLocation();
    return <Navigate to="/" replace state={{ from: loc }} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  loggedIn: PropTypes.bool,
};

export default ProtectedRoute;
