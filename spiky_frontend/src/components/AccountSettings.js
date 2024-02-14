import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

function AccountSettings() {
  let { user, authTokens } = useContext(AuthContext);
  const [accountInfo, setAccountInfo] = useState(null);

  // get user data
  const getUserAccountData = async () => {
    try {
      let response = await fetch(
        `http://127.0.0.1:8000/chat/api/get-user-account/${user.user_id}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setAccountInfo(data);
      } else {
        console.log("Error fetching user data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  // load user data
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  useEffect(() => {
    console.log("useEffect - getUserAccountData");
    getUserAccountData();
  }, [isCodeVerified]);

  const [accountEmail, setAccountEmail] = useState("");
  const [accountUsername, setAccountUsername] = useState("");
  let [isCodeRequested, setIsCodeRequested] = useState(false);
  let [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (accountInfo) {
      setAccountEmail(accountInfo.email);
      setAccountUsername(accountInfo.username);
    }
  }, [accountInfo]);

  const handleEditAccountUsername = () => {};
  const handleSendCode = async () => {
    if (verificationCode !== "") {
      const formData = new FormData();
      formData.append("user", user.user_id);
      formData.append("verification_code", verificationCode);
      formData.append("email", accountEmail);
      try {
        let response = await fetch(
          `http://127.0.0.1:8000/chat/api/get-email-change-code/${user.user_id}/`,
          {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsCodeVerified(true);
        setIsCodeRequested(false);
      }
    }
  };
  const handleGetCode = async () => {
    setIsCodeRequested(true);
    try {
      let response = await fetch(
        `http://127.0.0.1:8000/chat/api/get-email-change-code/${user.user_id}/`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
    console.log("verification code requested");
  };
  if (!accountInfo) {
    return <div>Loading...</div>;
  }
  return (
    <form>
      <h3>Account Settings:</h3>
      <div className="form-group mt-2">
        <label className="mb-1" htmlFor="account-email">
          Email:
        </label>
        <div className="d-flex align-items-center">
          <input
            className="form-control me-2"
            type="email"
            name="email"
            id="account-email"
            value={accountEmail}
            onChange={(e) => {
              setAccountEmail(e.target.value);
            }}
            placeholder="..."
            disabled={!isCodeRequested}
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleGetCode}
            disabled={isCodeRequested}
          >
            Change my email
          </button>
        </div>
        <div id="emailHelp" className="form-text">
          We'll send you a verification code to confirm email change.
        </div>
      </div>
      {isCodeRequested && (
        <div className="form-group mt-2">
          <label className="mb-1" htmlFor="account-code">
            Verification Code:
          </label>
          <div className="d-flex align-items-center">
            <input
              className="form-control me-2"
              type="text"
              name="code"
              id="account-code"
              onChange={(e) => {
                setVerificationCode(e.target.value);
              }}
              placeholder="Enter verification code..."
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSendCode}
            >
              Verify and Edit
            </button>
          </div>
        </div>
      )}
      <div className="form-group">
        <label className="mb-1" htmlFor="account-username">
          Username:
        </label>
        <div className="d-flex align-items-center">
          <input
            className="form-control me-2"
            type="text"
            name="username"
            id="account-username"
            value={accountUsername}
            onChange={(e) => {
              setAccountUsername(e.target.value);
            }}
            placeholder="..."
          />
          <button
            type="button"
            onClick={handleEditAccountUsername}
            className="btn btn-primary btn-sm mt-2"
          >
            Edit Username
          </button>
        </div>
      </div>
    </form>
  );
}

export default AccountSettings;
