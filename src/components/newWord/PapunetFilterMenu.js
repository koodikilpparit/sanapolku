import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PapunetFilterMenu.css';

const PapunetFilterMenu = ({ filters, selectedFilters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleCheckboxChange = (filterKey) => {
    if (selectedFilters.includes(filterKey)) {
      onFilterChange(selectedFilters.filter((filter) => filter !== filterKey));
    } else {
      onFilterChange([...selectedFilters, filterKey]);
    }
  };

  const handleUnselectAll = () => {
    onFilterChange([]);
  };

  return (
    <div className="filter-menu">
      <h3>Valitse kuvatyypit</h3>
      <button className="filter-menu-button" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} className="menu-icon" />
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <button
            className="unselect-all-button"
            onClick={handleUnselectAll}
            type="button"
          >
            Poista kaikki valinnat
          </button>

          {Object.entries(filters).map(([key, label]) => (
            <div key={key} className="filter-option">
              <input
                type="checkbox"
                id={key}
                checked={selectedFilters.includes(key)}
                onChange={() => handleCheckboxChange(key)}
              />
              <label htmlFor={key}>{label}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

PapunetFilterMenu.propTypes = {
  filters: PropTypes.objectOf(PropTypes.string).isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default PapunetFilterMenu;
