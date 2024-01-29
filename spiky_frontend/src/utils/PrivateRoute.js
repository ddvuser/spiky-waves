import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />;
};
export default PrivateRoute;
