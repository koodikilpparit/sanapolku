// RunButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons';

const RunButton = ({ onClick }) => (
  <button className="run-button" onClick={onClick}>
    <FontAwesomeIcon icon={faPersonRunning} className="run-icon" />
  </button>
);

RunButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RunButton;