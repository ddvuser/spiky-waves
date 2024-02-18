import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PassResetPage() {
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  let [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  let { token } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("new_password", new_password);
    formData.append("confirm_password", confirm_password);
    try {
      let response = await fetch(
        `http://127.0.0.1:8000/auth/api/confirm-pass-reset/${token}/`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="row">
      {!isSmallScreen && <div className="col"></div>}
      <div className={!isSmallScreen ? "col-6" : "col ms-1 me-1"}>
        <h2>Confirm Password Reset</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="text"
              id="new-password"
              className="form-control"
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="text"
              id="confirm-password"
              className="form-control"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className="btn btn-primary mt-2" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
      {!isSmallScreen && <div className="col"></div>}
    </div>
  );
}

export default PassResetPage;
