import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  let { user } = useContext(AuthContext);

  return user ? <Component {...rest} /> : <Navigate to="/login" replace />;
};
export default PrivateRoute;
