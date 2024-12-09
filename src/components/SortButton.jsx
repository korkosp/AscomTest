import React from 'react';
import '../styles/SortButton.css';

const SortButton = ({ 
  children, 
  onClick, 
  className = '', 
  active = false, 
  sortDirection = null 
}) => {
  return (
    <button 
      className={`sort-button ${className} ${active ? 'active' : ''}`} 
      onClick={onClick}
    >
      <span className="sort-button-text">{children}</span>
      {sortDirection && (
        <span className="sort-indicator">
          {sortDirection === 'asc' ? '▲' : '▼'}
        </span>
      )}
    </button>
  );
};

export default SortButton;
