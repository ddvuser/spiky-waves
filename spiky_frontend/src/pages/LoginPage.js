import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);

  let [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="row">
      {!isSmallScreen && <div className="col"></div>}
      <div className={!isSmallScreen ? "col-6" : "col ms-1 me-1"}>
        <form onSubmit={loginUser}>
          <div className="form-group mt-2 mb-2">
            <label className="mb-1" htmlFor="login-email">
              Email address:
            </label>
            <input
              className="form-control"
              type="text"
              name="email"
              id="login-email"
              placeholder="name@example.com"
            />
          </div>
          <div className="form-group">
            <label className="mb-1" htmlFor="login-password">
              Password:
            </label>
            <input
              className="form-control"
              type="password"
              name="password"
              id="login-password"
              placeholder="..."
            />
          </div>
          <div className="form-group">
            <Link to="/init-pass-reset">Forgot your password?</Link>
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Login
          </button>
        </form>
      </div>
      {!isSmallScreen && <div className="col"></div>}
    </div>
  );
};

export default LoginPage;
