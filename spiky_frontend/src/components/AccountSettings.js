import React, { useState, useContext, useEffect } from "react";

function AccountSettings() {
  // fetch user data
  // TODO

  let [accountEmail, setAccountEmail] = useState("");
  let [accountUsername, setAccountUsername] = useState("");
  let [isEmailChanged, setIsEmailChanged] = useState(false);
  let [verificationCode, setVerificationCode] = useState("");

  const handleEditAccount = () => {
    console.log({ accountEmail, accountUsername });
  };
  const handleVerification = () => {};
  return (
    <form>
      <h3>Account Settings:</h3>
      <div className="form-group mt-2">
        <label className="mb-1" htmlFor="account-email">
          Email:
        </label>
        <input
          className="form-control"
          type="email"
          name="email"
          id="account-email"
          value={accountEmail}
          onChange={(e) => {
            setAccountEmail(e.target.value);
          }}
          placeholder="..."
        />
        <div id="emailHelp" className="form-text">
          We'll send you a verification code to confirm email change.
        </div>
      </div>
      {isEmailChanged && (
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
              value={accountEmail}
              onChange={(e) => {
                setVerificationCode(e.target.value);
              }}
              placeholder="Enter verification code..."
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleVerification}
            >
              Verify
            </button>
          </div>
        </div>
      )}
      <div className="form-group">
        <label className="mb-1" htmlFor="account-username">
          Username:
        </label>
        <input
          className="form-control"
          type="text"
          name="username"
          id="account-username"
          value={accountUsername}
          onChange={(e) => {
            setAccountUsername(e.target.value);
          }}
          placeholder="..."
        />
      </div>
      <button
        type="button"
        onClick={handleEditAccount}
        className="btn btn-primary mt-2"
      >
        Edit Account
      </button>
    </form>
  );
}

export default AccountSettings;
