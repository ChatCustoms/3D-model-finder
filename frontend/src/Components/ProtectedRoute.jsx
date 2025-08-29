import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// const ProtectedRoute = ({ children, loggedIn }) => {
//   const location = useLocation();
//   console.log("ProtectedRoute - loggedIn:", loggedIn);

//   if (loggedIn === undefined || loggedIn === null) {
//     return null;
//   }

//   if (!loggedIn) {
//     return <Navigate to="/" replace state={{ from: location }} />;
//   }

//   return children;
// };

export default function ProtectedRoute(props) {
  const { loggedIn, children } = props;
  console.log("ProtectedRoute props:", props); // <-- should show { loggedIn: true/false, children: ... }

  // handle loading/null
  if (loggedIn === undefined || loggedIn === null) return null;

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

// export default ProtectedRoute;
