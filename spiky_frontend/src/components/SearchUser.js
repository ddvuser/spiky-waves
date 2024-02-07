import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

function SearchUser({ onSearchResult }) {
  let [searchQuery, setSearchQuery] = useState("");
  let [searchResult, setSearchResult] = useState("");
  let { authTokens } = useContext(AuthContext);

  // Search
  let applySearch = async (e) => {
    console.log("Users search applied");
    let response = await fetch(
      `http://127.0.0.1:8000/chat/api/search-user/${searchQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await response.json();
    if (response.status === 200) {
      setSearchResult(data);
      onSearchResult(data);
    } else {
      console.log("error fetching user");
    }
  };

  return (
    <form className="form-inline">
      <div className="d-flex">
        <input
          className="form-control"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
        <button
          onClick={applySearch}
          className="btn btn-outline-success"
          type="button"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchUser;
