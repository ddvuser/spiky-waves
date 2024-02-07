import React from "react";

function SearchResults({ searchResults }) {
  return (
    <div className="list-group">
      {searchResults.map((result) => (
        <div key={result.id} className="list-group-item">
          <div className="d-flex align-items-center">
            <img
              src={result.image}
              className="rounded-circle me-2"
              alt={result.full_name}
              style={{ width: "40px", height: "40px" }}
            />
            <p className="mb-1">{result.full_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
