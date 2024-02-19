import React, { useState, useEffect } from "react";

function InitPassResetPage() {
  const [email, setEmail] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    const formData = new FormData();
    formData.append("email", email);
    try {
      let response = await fetch(
        `http://127.0.0.1:8000/auth/api/init-reset-pass/`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  return (
    <div className="row">
      {!isSmallScreen && <div className="col"></div>}
      <div className={!isSmallScreen ? "col-6" : "col ms-1 me-1"}>
        <h2>Initiate Password Reset</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <div className="d-flex align-items-center">
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn btn-primary ms-2" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      {!isSmallScreen && <div className="col"></div>}
    </div>
  );
}

export default InitPassResetPage;
