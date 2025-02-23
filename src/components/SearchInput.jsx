import React from 'react';
import searchIcon from '../assets/images/icons/search.svg';
import './SearchInput.css';

function SearchInput({ searchTerm, onSearchChange }) {
  return (
    <div className="search-container">
      <img src={searchIcon} alt="Search Icon" className="search-icon" />
      <input
        type="text"
        placeholder="Search revenue sources..."
        value={searchTerm}
        onChange={onSearchChange}
        className="search-input"
      />
    </div>
  );
}

export default SearchInput;
