// PawButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

const PawButton = ({ onClick, style }) => (
  <button className="paw-button" onClick={onClick} style={style}>
    <FontAwesomeIcon icon={faPaw} className="paw-icon" />
  </button>
);

PawButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default PawButton;