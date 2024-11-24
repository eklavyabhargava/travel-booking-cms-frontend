import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const authToken = localStorage.getItem("authtoken");

  if (authToken) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
