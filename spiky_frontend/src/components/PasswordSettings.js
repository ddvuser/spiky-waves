import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

function PasswordSettings() {
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { user, authTokens } = useContext(AuthContext);

  const handleBeginChangePass = () => {
    setIsChangePassword(true);
  };

  const handleChangePassword = async () => {
    if (
      currentPassword != "" &&
      newPassword != "" &&
      confirmNewPassword != ""
    ) {
      const formData = new FormData();
      formData.append("user", user.user_id);
      formData.append("current_password", currentPassword);
      formData.append("new_password", newPassword);
      formData.append("confirm_new_password", confirmNewPassword);
      try {
        let response = await fetch(
          `http://127.0.0.1:8000/auth/api/change-password/${user.user_id}/`,
          {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    } else {
      console.log("you must fill in all fields");
    }
  };

  return (
    <form>
      <h3>Password Settings:</h3>
      {!isChangePassword && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleBeginChangePass}
        >
          Change my password
        </button>
      )}
      {isChangePassword && (
        <>
          <div className="form-group mt-2">
            <label htmlFor="account-email">Current password:</label>
            <input
              className="form-control me-2"
              type="password"
              name="current_password"
              id="current-password"
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
              placeholder="..."
            />
          </div>
          <div className="form-group mt-2">
            <label className="mb-1" htmlFor="account-code">
              New password:
            </label>
            <input
              className="form-control me-2"
              type="password"
              name="new_password"
              id="new-password"
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              placeholder="..."
            />
          </div>
          <div className="form-group mt-2">
            <label className="mb-1" htmlFor="account-username">
              Confirm new password:
            </label>
            <input
              className="form-control me-2"
              type="password"
              name="confirm_new_password"
              id="new-confirm"
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
              }}
              placeholder="..."
            />
          </div>
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={handleChangePassword}
          >
            Confirm password change
          </button>
        </>
      )}
    </form>
  );
}

export default PasswordSettings;
