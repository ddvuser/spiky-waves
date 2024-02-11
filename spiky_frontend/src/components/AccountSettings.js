import React, { useState, useCallback, useEffect } from "react";

function AccountSettings() {
  // fetch user data
  // TODO

  let [accountEmail, setAccountEmail] = useState("");
  let [accountUsername, setAccountUsername] = useState("");

  const handleEditAccount = () => {
    console.log("edit account");
  };
  return (
    <form>
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
          onChange={(e) => {}}
          placeholder="..."
        />
      </div>
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
          onChange={(e) => {}}
          placeholder="..."
        />
      </div>
      <button
        type="button"
        onClick={handleEditAccount}
        className="btn btn-primary mt-2"
      >
        Edit
      </button>
    </form>
  );
}

export default AccountSettings;
