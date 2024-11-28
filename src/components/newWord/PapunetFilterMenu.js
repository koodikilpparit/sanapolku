import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PapunetFilterMenu.css';

const public_url = process.env.PUBLIC_URL;

const PapunetFilterMenu = ({ filters, selectedFilters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(selectedFilters);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleCheckboxChange = (filterKey) => {
    if (tempFilters.includes(filterKey)) {
      setTempFilters(tempFilters.filter((filter) => filter !== filterKey));
    } else {
      setTempFilters([...tempFilters, filterKey]);
    }
  };

  const handleUnselectAll = () => {
    setTempFilters([]);
  };

  const applyFilters = () => {
    onFilterChange(tempFilters);
    setIsOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="filter-menu">
      <div className="filter-menu-header" onClick={toggleMenu}>
        <h3>Valitse kuvatyypit ({selectedFilters.length})</h3>
        <FontAwesomeIcon icon={faBars} className="menu-icon" />
      </div>

      {isOpen && (
        <div className="filter-dropdown">
          <button
            className="unselect-all-button"
            onClick={handleUnselectAll}
            type="button"
          >
            Poista kaikki valinnat
          </button>

          <div className="filter-options-container">
            {Object.entries(filters).map(([key, label]) => (
              <label key={key} htmlFor={key} className="filter-option">
                <input
                  type="checkbox"
                  id={key}
                  checked={tempFilters.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                />
                <span className="filter-label">{label}</span>
                <img
                  src={public_url + `/papunet-img-types/${key}.png`}
                  alt={label}
                  className="filter-icon"
                />
              </label>
            ))}
          </div>

          <button
            className="apply-filters-btn"
            onClick={applyFilters}
            type="button"
          >
            KÄYTÄ VALINTOJA
          </button>
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
