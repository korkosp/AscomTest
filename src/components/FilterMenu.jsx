import React, { useState, useEffect, useRef } from 'react';
import '../styles/FilterMenu.css';
import '../styles/Grid.css';
const FilterMenu = ({ onFilterChange, onResetFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    showStable: true,
    showCritical: true,
    sexFilter: 'all',
    dateFilterType: 'none',
    minDate: '',
    maxDate: ''
  });

  const filterMenuRef = useRef(null);
  
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      showStable: true,
      showCritical: true,
      sexFilter: 'all',
      dateFilterType: 'none',
      minDate: '',
      maxDate: ''
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    onResetFilters(); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen && 
        filterMenuRef.current && 
        !filterMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      className="filter-menu-container" 
      ref={filterMenuRef}
    >
      <button 
        className="filter-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        filtri
      </button>
      <button className="reset-filters-button" onClick={handleResetFilters}>↩️</button>

      {isOpen && (
        <div className="filter-dropdown compact-dropdown">
          <div className="filter-grid">
            <div className="filter-column">
              <h4>Stato</h4>
              <label className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={filters.showStable}
                  onChange={(e) => handleFilterChange('showStable', e.target.checked)}
                />
                Stabili
              </label>
              <label className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={filters.showCritical}
                  onChange={(e) => handleFilterChange('showCritical', e.target.checked)}
                />
                Critici
              </label>
            </div>
            <div className="filter-column">
              <h4>Sesso</h4>
              <select 
                className="filter-select"
                value={filters.sexFilter}
                onChange={(e) => handleFilterChange('sexFilter', e.target.value)}
              >
                <option value="all">Tutti</option>
                <option value="M">Maschio</option>
                <option value="F">Femmina</option>
              </select>
            </div>
            <div className="filter-column">
              <h4>Data</h4>
              <select 
                className="filter-select"
                value={filters.dateFilterType}
                onChange={(e) => handleFilterChange('dateFilterType', e.target.value)}
              >
                <option value="none">Nessun Filtro</option>
                <option value="range">data</option>
              </select>
              {filters.dateFilterType === 'range' && (
                <div className="date-range-inputs">
                  <div className="date-input-wrapper">
                    <label>Da</label>
                    <input 
                      type="date" 
                      className="cmc-date-input"
                      value={filters.minDate}
                      onChange={(e) => handleFilterChange('minDate', e.target.value)}
                    />
                  </div>
                  <div className="date-input-wrapper">
                    <label>A</label>
                    <input 
                      type="date" 
                      className="cmc-date-input"
                      value={filters.maxDate}
                      onChange={(e) => handleFilterChange('maxDate', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMenu;