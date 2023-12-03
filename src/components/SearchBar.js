import React from "react";

const SearchBar = ({ searchQuery, handleSearchQuery }) => {
  return (
    <div className="searchbar-wrapper">
      <input
        className="searchbar-input"
        type="text"
        defaultValue={searchQuery}
        onChange={(e) => handleSearchQuery(e.target.value)}
        placeholder="Enter Name or email or role"
      />
    </div>
  );
};

export default SearchBar;
