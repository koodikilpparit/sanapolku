// HouseButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const HouseButton = ({ onClick, style }) => (
  <button className="house-button" onClick={onClick} style={style}>
    <FontAwesomeIcon icon={faHouse} className="house-icon" />
  </button>
);

HouseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default HouseButton;